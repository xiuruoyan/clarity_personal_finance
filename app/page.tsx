"use client";

import { FormEvent, useMemo, useState } from "react";

type View = "overview" | "transactions" | "habits" | "goal";
type Period = "monthly" | "daily";

const navItems: { id: View; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "⌂" },
  { id: "transactions", label: "Transactions", icon: "↗" },
  { id: "habits", label: "Habits", icon: "◎" },
  { id: "goal", label: "Savings goal", icon: "◇" },
];

const transactions = [
  { id: 1, day: "Today", date: "Aug 29", merchant: "Whole Foods Market", detail: "Groceries", category: "Food & dining", amount: 84.26, icon: "WF", tone: "sage" },
  { id: 2, day: "Today", date: "Aug 29", merchant: "MTA Metro", detail: "Transportation", category: "Transport", amount: 2.9, icon: "M", tone: "blue" },
  { id: 3, day: "Yesterday", date: "Aug 28", merchant: "Ritual Coffee", detail: "Coffee shop", category: "Food & dining", amount: 7.4, icon: "RC", tone: "sand" },
  { id: 4, day: "Yesterday", date: "Aug 28", merchant: "Netflix", detail: "Subscription", category: "Entertainment", amount: 15.49, icon: "N", tone: "rose" },
  { id: 5, day: "Aug 27", date: "Aug 27", merchant: "Shell", detail: "Fuel", category: "Transport", amount: 52.1, icon: "S", tone: "gold" },
  { id: 6, day: "Aug 27", date: "Aug 27", merchant: "Blue Bottle", detail: "Coffee shop", category: "Food & dining", amount: 8.25, icon: "BB", tone: "sand" },
  { id: 7, day: "Aug 26", date: "Aug 26", merchant: "City Apartments", detail: "Rent", category: "Housing", amount: 1450, icon: "CA", tone: "green" },
  { id: 8, day: "Aug 25", date: "Aug 25", merchant: "Spotify", detail: "Subscription", category: "Entertainment", amount: 11.99, icon: "S", tone: "mint" },
];

const monthlyCategories = [
  { name: "Housing", value: 1450, color: "#174f3b" },
  { name: "Food & dining", value: 642, color: "#75a556" },
  { name: "Transport", value: 425, color: "#b9d68d" },
  { name: "Everything else", value: 768, color: "#e0e8d7" },
];

const dailyCategories = [
  { name: "Groceries", value: 84.26, color: "#174f3b" },
  { name: "Transport", value: 2.9, color: "#75a556" },
  { name: "Dining", value: 22.4, color: "#b9d68d" },
  { name: "Other", value: 12.5, color: "#e0e8d7" },
];

const advice = [
  { icon: "⌁", label: "Dining", title: "Plan two more dinners at home", copy: "Your takeout spend is 23% higher than your 3-month average.", savings: 94, tone: "lime" },
  { icon: "↻", label: "Subscriptions", title: "Review two overlapping services", copy: "Netflix and Hulu have had low activity for six weeks.", savings: 28, tone: "lavender" },
  { icon: "☕", label: "Routine", title: "Try a three-day coffee cap", copy: "Weekday coffee runs average $41 each week.", savings: 36, tone: "peach" },
];

const formatMoney = (value: number, digits = 0) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);

function PeriodToggle({ period, onChange }: { period: Period; onChange: (period: Period) => void }) {
  return (
    <div className="segmented" role="group" aria-label="Analysis period">
      <button className={period === "monthly" ? "active" : ""} onClick={() => onChange("monthly")}>Monthly</button>
      <button className={period === "daily" ? "active" : ""} onClick={() => onChange("daily")}>Daily</button>
    </div>
  );
}

function AccountModal({ onClose, onConnect }: { onClose: () => void; onConnect: (bank: string) => void }) {
  const [bank, setBank] = useState("Chase");
  return (
    <div className="modal-backdrop">
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="connect-title">
        <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <span className="plaid-mark">P</span>
        <p className="eyebrow">SECURE CONNECTION</p>
        <h2 id="connect-title">Connect your bank</h2>
        <p className="modal-copy">Choose a demo institution to preview how Clarity brings your balances and transactions together through Plaid.</p>
        <div className="bank-list">
          {["Chase", "Bank of America", "Wells Fargo", "Capital One"].map((name) => (
            <button key={name} className={bank === name ? "bank active" : "bank"} onClick={() => setBank(name)}>
              <span className="bank-logo">{name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</span><span>{name}<small>Checking & savings</small></span><span className="radio">{bank === name ? "●" : "○"}</span>
            </button>
          ))}
        </div>
        <button className="primary wide" onClick={() => onConnect(bank)}>Connect demo account <span>→</span></button>
        <p className="security-note">▣ Bank-level encryption · Clarity never sees your credentials</p>
      </section>
    </div>
  );
}

export default function Home() {
  const [view, setView] = useState<View>("overview");
  const [period, setPeriod] = useState<Period>("monthly");
  const [connectedBank, setConnectedBank] = useState<string | null>(null);
  const [connectOpen, setConnectOpen] = useState(false);
  const [goal, setGoal] = useState(2000);
  const [saved, setSaved] = useState(1420);
  const [contribution, setContribution] = useState("100");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [notice, setNotice] = useState("");

  const categories = period === "monthly" ? monthlyCategories : dailyCategories;
  const total = categories.reduce((sum, category) => sum + category.value, 0);
  const progress = Math.min(100, Math.round((saved / goal) * 100));
  const filteredTransactions = useMemo(() => transactions.filter((transaction) => {
    const matchesSearch = `${transaction.merchant} ${transaction.category}`.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (filter === "All" || transaction.category === filter);
  }), [search, filter]);

  const changeView = (next: View) => { setView(next); setNotice(""); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const connectBank = (bank: string) => { setConnectedBank(bank); setConnectOpen(false); setNotice(`${bank} connected. 84 transactions analyzed.`); };
  const addContribution = (event: FormEvent) => {
    event.preventDefault();
    const amount = Number(contribution);
    if (amount > 0) { setSaved((current) => current + amount); setNotice(`${formatMoney(amount)} added to your August goal.`); }
  };
  const applySaving = (amount: number, title: string) => { setSaved((current) => current + amount); setNotice(`${formatMoney(amount)} from “${title}” added to your plan.`); };

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => changeView("overview")} aria-label="Clarity home"><span className="brand-mark">C</span><span>Clarity</span></button>
        <nav aria-label="Main navigation">
          {navItems.map((item) => <button key={item.id} className={`nav-item ${view === item.id ? "active" : ""}`} onClick={() => changeView(item.id)}><span>{item.icon}</span>{item.label}</button>)}
        </nav>
        <div className="sidebar-tip"><span>✦</span><strong>Save $158 more</strong><p>Three small changes could move your goal forward.</p><button onClick={() => changeView("habits")}>View ideas</button></div>
        <div className="sidebar-footer">
          <button className="nav-item"><span>?</span>Help & support</button>
          <button className="profile"><span className="avatar">AC</span><span><strong>Alex Chen</strong><small>alex@example.com</small></span><span className="chevron">⌄</span></button>
        </div>
      </aside>

      <section className="main-content">
        <header className="topbar">
          <div><p className="eyebrow">SATURDAY, AUGUST 29</p><h1>{view === "overview" ? "Good morning, Alex." : view === "transactions" ? "Your transactions" : view === "habits" ? "Your money habits" : "Your savings goal"}</h1></div>
          <div className="top-actions">
            <button className="icon-button" aria-label="Notifications">♢<span className="notification-dot" /></button>
            <button className={connectedBank ? "connect-button connected" : "connect-button"} onClick={() => setConnectOpen(true)}><span>{connectedBank ? "✓" : "+"}</span>{connectedBank ? connectedBank : "Connect an account"}</button>
          </div>
        </header>

        {notice && <div className="notice" role="status"><span>✓</span>{notice}<button onClick={() => setNotice("")} aria-label="Dismiss">×</button></div>}

        {view === "overview" && <>
          <div className="summary-grid">
            <article className="card summary-card"><div className="card-heading"><span>Available balance</span><span className="account-pill">3 accounts</span></div><h2>$12,480.24</h2><p className="positive">↑ 8.4% <span>from last month</span></p></article>
            <article className="card summary-card"><div className="card-heading"><span>Spent this month</span><span className="more">•••</span></div><div className="spend-row"><div><h2>$3,284.60</h2><p>$715.40 under budget</p></div><div className="sparkline" aria-hidden="true">{[36,58,43,67,52,74,62,85,78,96].map((height,index)=><span key={index} style={{height:`${height}%`}} />)}</div></div></article>
            <article className="card summary-card"><div className="card-heading"><span>Monthly savings</span><span className="goal-badge">{progress >= 70 ? "On track" : "Keep going"}</span></div><h2>{formatMoney(saved)} <small>of {formatMoney(goal)}</small></h2><div className="progress"><span style={{width:`${progress}%`}} /></div><p>{formatMoney(Math.max(0, goal-saved))} to go · 3 days left</p></article>
          </div>
          <div className="dashboard-grid">
            <article className="card spending-panel">
              <div className="panel-title"><div><p className="eyebrow">SPENDING OVERVIEW</p><h3>Your money, at a glance</h3></div><PeriodToggle period={period} onChange={setPeriod} /></div>
              <div className="chart-wrap">
                <div className={`donut ${period}`}><div><strong>{formatMoney(total > 999 ? total/1000 : total, total > 999 ? 2 : 0)}{total > 999 ? "k" : ""}</strong><span>{period === "monthly" ? "total spent" : "spent today"}</span></div></div>
                <div className="legend">{categories.map((category)=><div key={category.name}><span className="dot" style={{background:category.color}} /><span>{category.name}<small>{formatMoney(category.value, category.value < 100 ? 2 : 0)}</small></span><strong>{Math.round((category.value/total)*100)}%</strong></div>)}</div>
              </div>
            </article>
            <article className="card insight-panel"><p className="eyebrow">SMART INSIGHT</p><div className="insight-icon">✦</div><h3>Small swaps, real savings.</h3><p>You spent <strong>$186 on takeout</strong> this month. Cooking at home twice more each week could save about <strong>$94/month.</strong></p><button onClick={() => changeView("habits")}>See my saving plan <span>→</span></button></article>
          </div>
          <article className="card recent-panel"><div className="panel-title"><div><p className="eyebrow">RECENT ACTIVITY</p><h3>Latest transactions</h3></div><button className="text-button" onClick={() => changeView("transactions")}>View all <span>→</span></button></div><div className="mini-transactions">{transactions.slice(0,4).map((transaction)=><div key={transaction.id} className="transaction-row"><span className={`merchant-icon ${transaction.tone}`}>{transaction.icon}</span><span><strong>{transaction.merchant}</strong><small>{transaction.detail} · {transaction.date}</small></span><strong className="amount">−{formatMoney(transaction.amount,2)}</strong></div>)}</div></article>
        </>}

        {view === "transactions" && <section className="page-stack">
          <div className="metric-strip"><div><span>August spend</span><strong>$3,284.60</strong><small className="positive">↓ 9.2% vs July</small></div><div><span>Daily average</span><strong>$113.26</strong><small>$7.40 below target</small></div><div><span>Largest category</span><strong>Housing</strong><small>44% of total spend</small></div></div>
          <article className="card transaction-panel">
            <div className="transaction-toolbar"><div><p className="eyebrow">CATEGORIZED AUTOMATICALLY</p><h3>August activity</h3></div><PeriodToggle period={period} onChange={setPeriod} /></div>
            {period === "monthly" && <div className="category-summary">{monthlyCategories.map((category)=><button key={category.name} onClick={() => setFilter(category.name === "Everything else" ? "All" : category.name)}><span className="dot" style={{background:category.color}} /><span>{category.name}<small>{formatMoney(category.value)}</small></span><strong>{Math.round(category.value/32.846)}%</strong></button>)}</div>}
            <div className="filter-row"><label className="search"><span>⌕</span><input value={search} onChange={(event)=>setSearch(event.target.value)} placeholder="Search transactions" aria-label="Search transactions" /></label><label className="category-filter">Category <select value={filter} onChange={(event)=>setFilter(event.target.value)}><option>All</option><option>Housing</option><option>Food & dining</option><option>Transport</option><option>Entertainment</option></select></label></div>
            <div className="transaction-table"><div className="table-head"><span>Merchant</span><span>Category</span><span>Date</span><span>Amount</span></div>{filteredTransactions.map((transaction)=><div key={transaction.id} className="table-row"><span className="merchant-cell"><span className={`merchant-icon ${transaction.tone}`}>{transaction.icon}</span><span><strong>{transaction.merchant}</strong><small>{transaction.detail}</small></span></span><span><span className="category-chip">{transaction.category}</span></span><span className="date-cell">{transaction.date}</span><strong className="amount">−{formatMoney(transaction.amount,2)}</strong></div>)}{filteredTransactions.length===0&&<p className="empty">No transactions match those filters.</p>}</div>
          </article>
        </section>}

        {view === "habits" && <section className="page-stack">
          <div className="habit-hero card"><div><p className="eyebrow">PATTERNS FOUND IN 84 TRANSACTIONS</p><h2>Your habits tell a story.</h2><p>Clarity looks beyond categories to show when, where, and why your spending repeats.</p></div><div className="habit-score"><strong>82</strong><span>Healthy habits</span><small>↑ 6 points this month</small></div></div>
          <div className="habit-grid">
            <article className="card habit-card"><span className="habit-icon peach">☕</span><p className="eyebrow">WEEKDAY ROUTINE</p><h3>Coffee is your most consistent small spend.</h3><p>12 visits this month, usually between 8–10 AM. Average: $7.15.</p><div className="week-dots">{["M","T","W","T","F","S","S"].map((day,index)=><span key={`${day}${index}`} className={index<5?"filled":""}>{day}</span>)}</div></article>
            <article className="card habit-card"><span className="habit-icon lavender">↻</span><p className="eyebrow">RECURRING COST</p><h3>Seven subscriptions total $126 each month.</h3><p>Two services overlap and have risen 18% since January.</p><div className="habit-meter"><span style={{width:"72%"}} /></div><small>$1,512 projected this year</small></article>
            <article className="card habit-card"><span className="habit-icon lime">⌁</span><p className="eyebrow">WEEKEND EFFECT</p><h3>You spend 41% more on Saturdays.</h3><p>Dining and rideshare make up most of the difference.</p><div className="tiny-bars">{[35,28,42,31,46,83,61].map((height,index)=><span key={index} style={{height:`${height}%`}} />)}</div></article>
          </div>
          <div className="section-heading"><div><p className="eyebrow">PERSONALIZED FOR YOU</p><h2>Three ways to save $158/month</h2></div><p>These suggestions protect the things you enjoy while trimming low-value spend.</p></div>
          <div className="advice-grid">{advice.map((item)=><article className="card advice-card" key={item.title}><span className={`advice-icon ${item.tone}`}>{item.icon}</span><span className="advice-label">{item.label}</span><h3>{item.title}</h3><p>{item.copy}</p><div><strong>+{formatMoney(item.savings)}/mo</strong><button onClick={()=>applySaving(item.savings,item.title)}>Add to plan</button></div></article>)}</div>
        </section>}

        {view === "goal" && <section className="page-stack">
          <article className="goal-hero card">
            <div className="goal-copy"><p className="eyebrow">AUGUST SAVINGS GOAL</p><h2>{progress}% of the way there.</h2><p>You’re ahead of your usual pace. Keep an average of {formatMoney(Math.max(0,(goal-saved)/3))} per day to finish by Monday.</p><div className="goal-numbers"><span><small>Saved</small><strong>{formatMoney(saved)}</strong></span><span><small>Goal</small><strong>{formatMoney(goal)}</strong></span><span><small>Remaining</small><strong>{formatMoney(Math.max(0,goal-saved))}</strong></span></div></div>
            <div className="goal-ring" style={{"--progress":`${progress*3.6}deg`} as React.CSSProperties}><div><strong>{progress}%</strong><span>on track</span></div></div>
          </article>
          <div className="goal-grid">
            <article className="card goal-settings"><p className="eyebrow">UPDATE YOUR PLAN</p><h3>Set your monthly target</h3><label>Monthly savings goal<div className="money-input"><span>$</span><input type="number" min="100" step="50" value={goal} onChange={(event)=>setGoal(Math.max(100,Number(event.target.value)))} /></div></label><input className="goal-slider" type="range" min="500" max="5000" step="100" value={goal} onChange={(event)=>setGoal(Number(event.target.value))} aria-label="Monthly savings goal" /><div className="range-labels"><span>$500</span><span>$5,000</span></div><div className="goal-message"><span>✦</span><p><strong>Comfortably ambitious</strong>Based on your income and average bills, this goal leaves about $630 of monthly flexibility.</p></div></article>
            <article className="card contribution-card"><p className="eyebrow">TRACK PROGRESS</p><h3>Add a contribution</h3><form onSubmit={addContribution}><label>Amount<div className="money-input"><span>$</span><input type="number" min="1" step="1" value={contribution} onChange={(event)=>setContribution(event.target.value)} /></div></label><div className="quick-add">{[50,100,250].map((amount)=><button type="button" key={amount} onClick={()=>setContribution(String(amount))}>+${amount}</button>)}</div><button className="primary wide" type="submit">Add to August goal <span>→</span></button></form><p className="form-note">This tracker won’t move money. It helps you record savings already set aside.</p></article>
          </div>
          <article className="card milestone-card"><div><p className="eyebrow">MILESTONES</p><h3>Your progress this month</h3></div><div className="milestones">{[{value:500,label:"Strong start"},{value:1000,label:"Halfway"},{value:1500,label:"Momentum"},{value:2000,label:"Goal reached"}].map((item,index)=><div className={saved>=item.value?"reached":""} key={item.value}><span>{saved>=item.value?"✓":index+1}</span><strong>{formatMoney(item.value)}</strong><small>{item.label}</small></div>)}</div></article>
        </section>}
      </section>

      {connectOpen && <AccountModal onClose={()=>setConnectOpen(false)} onConnect={connectBank} />}
    </main>
  );
}
