import Link from "next/link";
import { demoExpenses, demoMembers } from "@/data/demo-group";
import {
  calculateBalances,
  formatMoney,
  simplifyDebts,
} from "@/domain/expenses";

const activeMemberId = "mara";

export function Dashboard() {
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
        <div>
          <p className="eyebrow">Signed-in workspace</p>
          <h1>
            Welcome back,
            <br />
            <em>{activeMember.name}.</em>
          </h1>
          <p className="dashboard-description">
            This is the member landing page after login: a calm snapshot of your
            groups, informal balances, and items that need review.
          </p>
        </div>
        <aside className="dashboard-balance-card">
          <span>Your informal balance</span>
          <strong>{formatMoney(Math.abs(activeBalance))}</strong>
          <p>{activeBalance >= 0 ? "You are owed" : "You owe"} in demo groups</p>
        </aside>
      </section>

      <section className="dashboard-summary" aria-label="Ledger summary">
        <article>
          <span>Group spend</span>
          <strong>{formatMoney(totalSpent)}</strong>
          <p>Tracked in the current demo group.</p>
        </article>
        <article>
          <span>Informal receivable</span>
          <strong>{formatMoney(receivable)}</strong>
          <p>Balances not converted into accepted debts.</p>
        </article>
        <article>
          <span>Informal due</span>
          <strong>{formatMoney(due)}</strong>
          <p>Amounts to settle outside Sumwork.</p>
        </article>
        <article>
          <span>Accepted debts</span>
          <strong>{formatMoney(0)}</strong>
          <p>No active debt agreements yet.</p>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-panel group-panel" id="groups">
          <div className="dashboard-panel-heading">
            <div>
              <p className="eyebrow">Primary group</p>
              <h2>Weekend away</h2>
            </div>
            <span>{demoMembers.length} members</span>
          </div>
          <div className="group-ledger">
            <div>
              <span>Total recorded</span>
              <strong>{formatMoney(totalSpent)}</strong>
            </div>
            <div>
              <span>Suggested payments</span>
              <strong>{settlements.length}</strong>
            </div>
            <div>
              <span>Accepted debts</span>
              <strong>0</strong>
            </div>
          </div>
          <div className="member-strip" aria-label="Group members">
            {demoMembers.map((member) => (
              <span key={member.id}>{member.name.slice(0, 1)}</span>
            ))}
          </div>
        </article>

        <article className="dashboard-panel action-panel">
          <div className="dashboard-panel-heading">
            <div>
              <p className="eyebrow">Next actions</p>
              <h2>Ready for data.</h2>
            </div>
          </div>
          <ol className="action-list">
            <li>
              <span>01</span>
              <div>
                <strong>Create your first real group</strong>
                <p>Connect this card to the group creation flow.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Invite members</strong>
                <p>Show invite states once Supabase profiles are available.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Record an expense</strong>
                <p>Reserved for the friend-owned expense workflow.</p>
              </div>
            </li>
          </ol>
        </article>

        <article className="dashboard-panel balances-panel" id="balances">
          <div className="dashboard-panel-heading">
            <div>
              <p className="eyebrow">Informal balances</p>
              <h2>Who is up or down.</h2>
            </div>
            <span>Not debt terms</span>
          </div>
          <div className="dashboard-balance-list">
            {balances.map((member) => (
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

        <article className="dashboard-panel activity-panel" id="activity">
          <div className="dashboard-panel-heading">
            <div>
              <p className="eyebrow">Recent activity</p>
              <h2>Ledger notes.</h2>
            </div>
          </div>
          <ol className="activity-list">
            {demoExpenses.map((expense, index) => (
              <li key={expense.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <strong>{expense.description}</strong>
                  <p>
                    Paid by {memberById.get(expense.paidByMemberId)?.name} ·{" "}
                    {expense.occurredOn}
                  </p>
                </div>
                <b>{formatMoney(expense.amountInCents)}</b>
              </li>
            ))}
          </ol>
        </article>
      </section>
    </main>
  );
}
