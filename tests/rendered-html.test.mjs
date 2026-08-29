import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders Clarity metadata and dashboard content", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Clarity — Personal finance, made clear<\/title>/i);
  assert.match(html, /Good morning, Alex/);
  assert.match(html, /Connect an account/);
  assert.match(html, /Monthly savings/);
  assert.match(html, /Your money, at a glance/);
  assert.doesNotMatch(html, /Your site is taking shape|codex-preview/);
});

test("repository contains the requested finance capabilities and safe documentation", async () => {
  const [page, readme, security, envExample] = await Promise.all([
    readFile(new URL("app/page.tsx", root), "utf8"),
    readFile(new URL("README.md", root), "utf8"),
    readFile(new URL("SECURITY.md", root), "utf8"),
    readFile(new URL(".env.example", root), "utf8"),
  ]);

  assert.match(page, /type Period = "monthly" \| "daily"/);
  assert.match(page, /Your money habits/);
  assert.match(page, /Set your monthly target/);
  assert.match(page, /Connect demo account/);
  assert.match(readme, /current account-connection flow uses representative data/);
  assert.match(security, /access tokens must remain server-side/i);
  assert.match(envExample, /PLAID_ENV=sandbox/);
  assert.doesNotMatch(envExample, /PLAID_SECRET=\S+/);
});
