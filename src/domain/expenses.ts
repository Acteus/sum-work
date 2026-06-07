export type Member = {
  id: string;
  name: string;
};

export type ExpenseShare = {
  memberId: string;
  amountInCents: number;
};

export type Expense = {
  id: string;
  description: string;
  amountInCents: number;
  paidByMemberId: string;
  occurredOn: string;
  shares: ExpenseShare[];
};

export type MemberBalance = Member & {
  balanceInCents: number;
};

export type Settlement = {
  fromMemberId: string;
  toMemberId: string;
  amountInCents: number;
};

function assertWholeCents(value: number, label: string) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`${label} must be a non-negative integer number of cents.`);
  }
}

function assertExpense(expense: Expense, memberIds: Set<string>) {
  assertWholeCents(expense.amountInCents, "Expense amount");

  if (!memberIds.has(expense.paidByMemberId)) {
    throw new Error(`Unknown payer: ${expense.paidByMemberId}`);
  }

  const allocated = expense.shares.reduce((total, share) => {
    if (!memberIds.has(share.memberId)) {
      throw new Error(`Unknown participant: ${share.memberId}`);
    }

    assertWholeCents(share.amountInCents, "Share amount");
    return total + share.amountInCents;
  }, 0);

  if (allocated !== expense.amountInCents) {
    throw new Error(
      `Expense ${expense.id} allocates ${allocated} cents, expected ${expense.amountInCents}.`,
    );
  }
}

export function calculateBalances(
  members: Member[],
  expenses: Expense[],
): MemberBalance[] {
  const balances = new Map(members.map((member) => [member.id, 0]));
  const memberIds = new Set(balances.keys());

  for (const expense of expenses) {
    assertExpense(expense, memberIds);
    balances.set(
      expense.paidByMemberId,
      balances.get(expense.paidByMemberId)! + expense.amountInCents,
    );

    for (const share of expense.shares) {
      balances.set(
        share.memberId,
        balances.get(share.memberId)! - share.amountInCents,
      );
    }
  }

  return members.map((member) => ({
    ...member,
    balanceInCents: balances.get(member.id) ?? 0,
  }));
}

export function simplifyDebts(balances: MemberBalance[]): Settlement[] {
  const creditors = balances
    .filter((member) => member.balanceInCents > 0)
    .map((member) => ({ ...member }))
    .sort((a, b) => b.balanceInCents - a.balanceInCents);
  const debtors = balances
    .filter((member) => member.balanceInCents < 0)
    .map((member) => ({ ...member, balanceInCents: -member.balanceInCents }))
    .sort((a, b) => b.balanceInCents - a.balanceInCents);
  const settlements: Settlement[] = [];

  let creditorIndex = 0;
  let debtorIndex = 0;

  while (
    creditorIndex < creditors.length &&
    debtorIndex < debtors.length
  ) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];
    const amountInCents = Math.min(
      creditor.balanceInCents,
      debtor.balanceInCents,
    );

    settlements.push({
      fromMemberId: debtor.id,
      toMemberId: creditor.id,
      amountInCents,
    });

    creditor.balanceInCents -= amountInCents;
    debtor.balanceInCents -= amountInCents;

    if (creditor.balanceInCents === 0) creditorIndex += 1;
    if (debtor.balanceInCents === 0) debtorIndex += 1;
  }

  return settlements;
}

export function splitEqually(
  amountInCents: number,
  memberIds: string[],
): ExpenseShare[] {
  assertWholeCents(amountInCents, "Expense amount");

  if (memberIds.length === 0) {
    throw new Error("At least one participant is required.");
  }

  const baseShare = Math.floor(amountInCents / memberIds.length);
  const remainder = amountInCents % memberIds.length;

  return memberIds.map((memberId, index) => ({
    memberId,
    amountInCents: baseShare + (index < remainder ? 1 : 0),
  }));
}

export function formatMoney(amountInCents: number, currency = "PHP") {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency,
  }).format(amountInCents / 100);
}
