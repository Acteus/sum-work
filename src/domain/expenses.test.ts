import { describe, expect, it } from "vitest";
import {
  calculateBalances,
  simplifyDebts,
  splitEqually,
  type Expense,
  type Member,
} from "./expenses";

const members: Member[] = [
  { id: "ana", name: "Ana" },
  { id: "bea", name: "Bea" },
  { id: "cal", name: "Cal" },
];

describe("splitEqually", () => {
  it("keeps every cent when an amount does not divide evenly", () => {
    expect(splitEqually(1_000, ["ana", "bea", "cal"])).toEqual([
      { memberId: "ana", amountInCents: 334 },
      { memberId: "bea", amountInCents: 333 },
      { memberId: "cal", amountInCents: 333 },
    ]);
  });
});

describe("calculateBalances", () => {
  it("credits payers and charges each participant's exact share", () => {
    const expenses: Expense[] = [
      {
        id: "dinner",
        description: "Dinner",
        amountInCents: 3_000,
        paidByMemberId: "ana",
        occurredOn: "2026-06-07",
        shares: splitEqually(3_000, members.map((member) => member.id)),
      },
      {
        id: "taxi",
        description: "Taxi",
        amountInCents: 1_200,
        paidByMemberId: "bea",
        occurredOn: "2026-06-07",
        shares: splitEqually(1_200, ["bea", "cal"]),
      },
    ];

    expect(calculateBalances(members, expenses)).toEqual([
      { id: "ana", name: "Ana", balanceInCents: 2_000 },
      { id: "bea", name: "Bea", balanceInCents: -400 },
      { id: "cal", name: "Cal", balanceInCents: -1_600 },
    ]);
  });

  it("rejects expenses whose shares do not match the total", () => {
    const invalidExpense: Expense = {
      id: "bad-math",
      description: "Bad math",
      amountInCents: 1_000,
      paidByMemberId: "ana",
      occurredOn: "2026-06-07",
      shares: [{ memberId: "ana", amountInCents: 999 }],
    };

    expect(() => calculateBalances(members, [invalidExpense])).toThrow(
      "allocates 999 cents, expected 1000",
    );
  });
});

describe("simplifyDebts", () => {
  it("produces a compact set of payments", () => {
    const balances = [
      { ...members[0], balanceInCents: 2_000 },
      { ...members[1], balanceInCents: -400 },
      { ...members[2], balanceInCents: -1_600 },
    ];

    expect(simplifyDebts(balances)).toEqual([
      { fromMemberId: "cal", toMemberId: "ana", amountInCents: 1_600 },
      { fromMemberId: "bea", toMemberId: "ana", amountInCents: 400 },
    ]);
  });
});
