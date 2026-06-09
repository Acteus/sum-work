"use client";

import Link from "next/link";
import { useState } from "react";
import { demoExpenses, demoMembers } from "@/data/demo-group";
import {
  calculateBalances,
  formatMoney,
  simplifyDebts,
} from "@/domain/expenses";

const activeMemberId = "mara";

type DashboardAction = {
  title: string;
  description: string;
};

type DashboardActivity = {
  id: string;
  title: string;
  description: string;
  amountInCents: number;
};

type DashboardBalance = {
  id: string;
  name: string;
  balanceInCents: number;
};

type DashboardGroup = {
  id: string;
  name: string;
  memberCount: number;
  memberInitials: string[];
  totalRecordedInCents: number;
  suggestedPaymentCount: number;
  acceptedDebtCount: number;
  acceptedDebtTotalInCents: number;
  activeMemberBalanceInCents: number;
  receivableInCents: number;
  dueInCents: number;
  reviewCount: number;
  actions: DashboardAction[];
  balances: DashboardBalance[];
  activities: DashboardActivity[];
};

type DashboardProps = {
  activeGroupId?: string;
};

export function Dashboard({ activeGroupId }: DashboardProps) {
  const balances = calculateBalances(demoMembers, demoExpenses);
  const settlements = simplifyDebts(balances);
  const memberById = new Map(demoMembers.map((member) => [member.id, member]));
  const activeMember = memberById.get(activeMemberId) ?? demoMembers[0];
  const activeBalance =
    balances.find((member) => member.id === activeMember.id)?.balanceInCents ??
    0;
  const totalSpent = demoExpenses.reduce(
    (total, expense) => total + expense.amountInCents,
    0,
  );
  const receivable = balances.reduce(
    (total, member) =>
      total + Math.max(0, member.balanceInCents),
    0,
  );
  const due = balances.reduce(
    (total, member) =>
      total + Math.max(0, -member.balanceInCents),
    0,
  );
  const groupSummaries: DashboardGroup[] = [
    {
      id: "weekend-away",
      name: "Weekend away",
      memberCount: demoMembers.length,
      memberInitials: demoMembers.map((member) => member.name.slice(0, 1)),
      totalRecordedInCents: totalSpent,
      suggestedPaymentCount: settlements.length,
      acceptedDebtCount: 0,
      acceptedDebtTotalInCents: 0,
      activeMemberBalanceInCents: activeBalance,
      receivableInCents: receivable,
      dueInCents: due,
      reviewCount: 0,
      actions: [
        {
          title: "Record the lodging receipt",
          description: "Add the last shared expense before settling.",
        },
        {
          title: "Review suggested payments",
          description: "Turn informal balances into external settlements.",
        },
        {
          title: "Invite Nico to confirm",
          description: "Keep the group list current before the next trip.",
        },
      ],
      balances,
      activities: demoExpenses.map((expense) => ({
        id: expense.id,
        title: expense.description,
        description: `Paid by ${
          memberById.get(expense.paidByMemberId)?.name
        } · ${expense.occurredOn}`,
        amountInCents: expense.amountInCents,
      })),
    },
    {
      id: "apartment",
      name: "Apartment",
      memberCount: 3,
      memberInitials: ["M", "J", "A"],
      totalRecordedInCents: 421_500,
      suggestedPaymentCount: 2,
      acceptedDebtCount: 1,
      acceptedDebtTotalInCents: 125_000,
      activeMemberBalanceInCents: -96_250,
      receivableInCents: 171_250,
      dueInCents: 267_500,
      reviewCount: 2,
      actions: [
        {
          title: "Confirm Meralco payment",
          description: "A proposed payment is awaiting your review.",
        },
        {
          title: "Review rent share",
          description: "One accepted debt has a due date this week.",
        },
        {
          title: "Invite Ana's new email",
          description: "Member access is pending confirmation.",
        },
      ],
      balances: [
        { id: "mara", name: "Mara", balanceInCents: -96_250 },
        { id: "jules", name: "Jules", balanceInCents: 171_250 },
        { id: "ana", name: "Ana", balanceInCents: -75_000 },
      ],
      activities: [
        {
          id: "rent-share",
          title: "June rent share",
          description: "Awaiting confirmation · 2026-06-07",
          amountInCents: 125_000,
        },
        {
          id: "utilities",
          title: "Meralco bill",
          description: "Paid by Jules · 2026-06-05",
          amountInCents: 96_500,
        },
        {
          id: "internet",
          title: "Internet plan",
          description: "Paid by Ana · 2026-06-03",
          amountInCents: 42_000,
        },
      ],
    },
    {
      id: "office-lunch",
      name: "Office lunch",
      memberCount: 6,
      memberInitials: ["M", "J", "S", "N", "L", "R"],
      totalRecordedInCents: 188_000,
      suggestedPaymentCount: 4,
      acceptedDebtCount: 0,
      acceptedDebtTotalInCents: 0,
      activeMemberBalanceInCents: 34_000,
      receivableInCents: 74_000,
      dueInCents: 74_000,
      reviewCount: 1,
      actions: [
        {
          title: "Check missing participant",
          description: "One lunch split needs review before settling.",
        },
        {
          title: "Record coffee reimbursement",
          description: "Keep external payments matched to the ledger.",
        },
        {
          title: "Archive last week's lunch",
          description: "Move settled activity out of the active view.",
        },
      ],
      balances: [
        { id: "mara", name: "Mara", balanceInCents: 34_000 },
        { id: "jules", name: "Jules", balanceInCents: -16_000 },
        { id: "sam", name: "Sam", balanceInCents: 40_000 },
        { id: "nico", name: "Nico", balanceInCents: -18_000 },
        { id: "lia", name: "Lia", balanceInCents: -20_000 },
        { id: "ren", name: "Ren", balanceInCents: -20_000 },
      ],
      activities: [
        {
          id: "team-lunch",
          title: "Team lunch",
          description: "Paid by Sam · 2026-06-06",
          amountInCents: 132_000,
        },
        {
          id: "coffee-receipt",
          title: "Coffee receipt",
          description: "Needs review · 2026-06-05",
          amountInCents: 36_000,
        },
        {
          id: "snacks",
          title: "Snack run",
          description: "Paid by Mara · 2026-06-04",
          amountInCents: 20_000,
        },
      ],
    },
  ];
  const initialGroup =
    groupSummaries.find((group) => group.id === activeGroupId) ??
    groupSummaries[0];
  const [selectedGroupId, setSelectedGroupId] = useState(initialGroup.id);
  const activeGroup =
    groupSummaries.find((group) => group.id === selectedGroupId) ??
    initialGroup;
  const selectGroup = (groupId: string) => {
    setSelectedGroupId(groupId);
    window.history.replaceState(null, "", `/dashboard?group=${groupId}`);
  };

  return (
    <main className="dashboard-page">
      <header className="dashboard-header">
        <Link className="brand" href="/dashboard" aria-label="Sumwork dashboard">
          sum<span>/</span>work
        </Link>
        <nav aria-label="Dashboard navigation">
          <a href="#groups">Groups</a>
          <a href="#balances">Balances</a>
          <a href="#activity">Activity</a>
          <Link className="outline-button" href="/login">
            Sign out
          </Link>
        </nav>
      </header>

      <section className="dashboard-hero">
        <div className="anim-slide-left">
          <p className="eyebrow anim-fade-up delay-1">Signed-in workspace</p>
          <h1 className="anim-fade-up delay-2">
            Welcome back,
            <br />
            <em>{activeMember.name}.</em>
          </h1>
          <p className="dashboard-description anim-fade-up delay-3">
            This is the member landing page after login: a calm snapshot of your
            groups, informal balances, and items that need review.
          </p>
        </div>
        <aside className="dashboard-balance-card anim-slide-right delay-2">
          <span>Your informal balance</span>
          <strong>
            {formatMoney(Math.abs(activeGroup.activeMemberBalanceInCents))}
          </strong>
          <p>
            {activeGroup.activeMemberBalanceInCents >= 0
              ? "You are owed"
              : "You owe"}{" "}
            in {activeGroup.name}
          </p>
        </aside>
      </section>

      <section className="dashboard-summary" aria-label="Ledger summary">
        <article>
          <span>Group spend</span>
          <strong>{formatMoney(activeGroup.totalRecordedInCents)}</strong>
          <p>Tracked in the selected group.</p>
        </article>
        <article>
          <span>Informal receivable</span>
          <strong>{formatMoney(activeGroup.receivableInCents)}</strong>
          <p>Balances not converted into accepted debts.</p>
        </article>
        <article>
          <span>Informal due</span>
          <strong>{formatMoney(activeGroup.dueInCents)}</strong>
          <p>Amounts to settle outside Sumwork.</p>
        </article>
        <article>
          <span>Accepted debts</span>
          <strong>{formatMoney(activeGroup.acceptedDebtTotalInCents)}</strong>
          <p>
            {activeGroup.acceptedDebtCount === 0
              ? "No active debt agreements yet."
              : "Accepted agreements shown separately."}
          </p>
        </article>
      </section>

      <section className="group-switcher-section" aria-labelledby="groups-title">
        <div className="group-switcher-heading">
          <div>
            <p className="eyebrow">Groups</p>
            <h2 id="groups-title">Choose a ledger.</h2>
          </div>
          <p>All active group ledgers available to your account.</p>
        </div>
        <div className="group-switcher" aria-label="Available groups">
          {groupSummaries.map((group, idx) => {
            const isActive = group.id === activeGroup.id;
            const delayClass = ["delay-1", "delay-2", "delay-3"][idx] ?? "";

            return (
              <button
                aria-current={isActive ? "page" : undefined}
                className={`group-switcher-card anim-fade-up ${delayClass}`}
                key={group.id}
                onClick={() => selectGroup(group.id)}
                type="button"
              >
                <span>{group.name}</span>
                <strong>{formatMoney(group.totalRecordedInCents)}</strong>
                <small>
                  {group.memberCount} members · {group.reviewCount} need review
                </small>
                <b>
                  {group.activeMemberBalanceInCents >= 0
                    ? "You are owed"
                    : "You owe"}{" "}
                  {formatMoney(Math.abs(group.activeMemberBalanceInCents))}
                </b>
              </button>
            );
          })}
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-panel group-panel anim-fade-up delay-1" id="groups">
          <div className="dashboard-panel-heading">
            <div>
              <p className="eyebrow">Selected group</p>
              <h2>{activeGroup.name}</h2>
            </div>
            <span>{activeGroup.memberCount} members</span>
          </div>
          <div className="group-ledger">
            <div>
              <span>Total recorded</span>
              <strong>{formatMoney(activeGroup.totalRecordedInCents)}</strong>
            </div>
            <div>
              <span>Suggested payments</span>
              <strong>{activeGroup.suggestedPaymentCount}</strong>
            </div>
            <div>
              <span>Accepted debts</span>
              <strong>{activeGroup.acceptedDebtCount}</strong>
            </div>
          </div>
          <div className="member-strip" aria-label="Group members">
            {activeGroup.memberInitials.map((initial, index) => (
              <span key={`${activeGroup.id}-${initial}-${index}`}>
                {initial}
              </span>
            ))}
          </div>
        </article>

        <article className="dashboard-panel action-panel anim-fade-up delay-2">
          <div className="dashboard-panel-heading">
            <div>
              <p className="eyebrow">Next actions</p>
              <h2>Ready for data.</h2>
            </div>
          </div>
          <ol className="action-list">
            {activeGroup.actions.map((action, index) => (
              <li key={action.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{action.title}</strong>
                  <p>{action.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </article>

        <article className="dashboard-panel balances-panel anim-fade-up delay-3" id="balances">
          <div className="dashboard-panel-heading">
            <div>
              <p className="eyebrow">Informal balances</p>
              <h2>Who is up or down.</h2>
            </div>
            <span>Not debt terms</span>
          </div>
          <div className="dashboard-balance-list">
            {activeGroup.balances.map((member) => (
              <div className="dashboard-balance-row" key={member.id}>
                <div className="person">
                  <span>{member.name.slice(0, 1)}</span>
                  <strong>{member.name}</strong>
                </div>
                <div
                  className={
                    member.balanceInCents >= 0 ? "positive" : "negative"
                  }
                >
                  <small>
                    {member.balanceInCents >= 0 ? "is owed" : "owes"}
                  </small>
                  <strong>{formatMoney(Math.abs(member.balanceInCents))}</strong>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="dashboard-panel activity-panel anim-fade-up delay-4" id="activity">
          <div className="dashboard-panel-heading">
            <div>
              <p className="eyebrow">Recent activity</p>
              <h2>Ledger notes.</h2>
            </div>
          </div>
          <ol className="activity-list">
            {activeGroup.activities.map((activity, index) => (
              <li key={activity.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{activity.title}</strong>
                  <p>{activity.description}</p>
                </div>
                <b>{formatMoney(activity.amountInCents)}</b>
              </li>
            ))}
          </ol>
        </article>
      </section>
    </main>
  );
}
