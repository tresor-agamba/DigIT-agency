import assert from "node:assert/strict";
import test from "node:test";
import { canApproveVersion, canRequestModification } from "./policy";

test("seule une version READY_FOR_REVIEW non approuvée est éligible", () => {
  assert.equal(canApproveVersion("READY_FOR_REVIEW", false), true);
  assert.equal(canApproveVersion("READY_FOR_REVIEW", true), false);
  assert.equal(canApproveVersion("DRAFT", false), false);
  assert.equal(canApproveVersion("CHANGES_REQUESTED", false), false);
  assert.equal(canApproveVersion("APPROVED", false), false);
  assert.equal(canApproveVersion("FINAL", false), false);
});

test("les versions approuvées et finales refusent de nouvelles demandes", () => {
  assert.equal(canRequestModification("APPROVED"), false);
  assert.equal(canRequestModification("FINAL"), false);
  assert.equal(canRequestModification("READY_FOR_REVIEW"), true);
  assert.equal(canRequestModification("CHANGES_REQUESTED"), false);
  assert.equal(canRequestModification("DRAFT"), false);
});
