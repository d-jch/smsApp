import { assertEquals } from "https://deno.land/std@0.201.0/testing/asserts.ts";
import { formatShared } from "../src/helpers.ts";

Deno.test("formatShared with value", () => {
  assertEquals(formatShared("hello"), "Shared: hello");
});

Deno.test("formatShared without value", () => {
  assertEquals(formatShared(undefined), "Shared: none");
});
