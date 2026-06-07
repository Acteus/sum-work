import { splitEqually, type Expense, type Member } from "@/domain/expenses";

export const demoMembers: Member[] = [
  { id: "mara", name: "Mara" },
  { id: "jules", name: "Jules" },
  { id: "sam", name: "Sam" },
  { id: "nico", name: "Nico" },
];

export const demoExpenses: Expense[] = [
  {
    id: "groceries",
    description: "Weekend groceries",
    amountInCents: 368_000,
    paidByMemberId: "mara",
    occurredOn: "2026-06-06",
    shares: splitEqually(368_000, demoMembers.map((member) => member.id)),
  },
  {
    id: "fuel",
    description: "Road trip fuel",
    amountInCents: 215_000,
    paidByMemberId: "jules",
    occurredOn: "2026-06-05",
    shares: splitEqually(215_000, ["mara", "jules", "sam"]),
  },
  {
    id: "coffee",
    description: "Coffee run",
    amountInCents: 72_000,
    paidByMemberId: "sam",
    occurredOn: "2026-06-04",
    shares: splitEqually(72_000, demoMembers.map((member) => member.id)),
  },
];
