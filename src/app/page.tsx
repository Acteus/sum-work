import { ContributionCard } from "@/components/marketing/contribution-card";
import { demoExpenses, demoMembers } from "@/data/demo-group";
import {
  calculateBalances,
  formatMoney,
  simplifyDebts,
} from "@/domain/expenses";
import Link from "next/link";

export default function Home() {
  const balances = calculateBalances(demoMembers, demoExpenses);
  const settlements = simplifyDebts(balances);
  const memberById = new Map(demoMembers.map((member) => [member.id, member]));
  const totalSpent = demoExpenses.reduce(
    (total, expense) => total + expense.amountInCents,
    0,
  );

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Sumwork home">
          sum<span>/</span>work
        </a>
        <nav aria-label="Primary navigation">
          <a href="#balances">Balances</a>
          <a href="#contribute">Open features</a>
          <Link href="/login">Sign in</Link>
          <Link className="outline-button" href="/register">
            Create account
          </Link>
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">A shared ledger for shared lives</p>
          <h1>
            Split the cost.
            <br />
            <em>Keep the friendship.</em>
          </h1>
          <p className="hero-description">
            Sumwork turns the awkward arithmetic after a trip, dinner, or
            grocery run into a short, fair list of payments.
          </p>
          <div className="hero-actions">
            <a className="solid-button" href="#balances">
              View demo group <span aria-hidden="true">↓</span>
            </a>
            <span>PHP · exact-cent calculations</span>
          </div>
        </div>
        <div className="hero-mark" aria-hidden="true">
          <span>₱</span>
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
        </div>
      </section>

      <section className="ledger-section" id="balances">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Demo group · Weekend away</p>
            <h2>The money, resolved.</h2>
          </div>
          <div className="total-block">
            <span>Total group spend</span>
            <strong>{formatMoney(totalSpent)}</strong>
          </div>
        </div>

        <div className="ledger-grid">
          <article className="balance-panel">
            <div className="panel-title">
              <h3>Current balances</h3>
              <span>{demoMembers.length} people</span>
            </div>
            <div className="balance-list">
              {balances.map((member) => (
                <div className="balance-row" key={member.id}>
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
                      {member.balanceInCents >= 0 ? "gets back" : "owes"}
                    </small>
                    <strong>
                      {formatMoney(Math.abs(member.balanceInCents))}
                    </strong>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="settlement-panel">
            <div className="panel-title">
              <h3>Settle in {settlements.length}</h3>
              <span>minimum fuss</span>
            </div>
            <ol className="settlement-list">
              {settlements.map((settlement, index) => (
                <li key={`${settlement.fromMemberId}-${settlement.toMemberId}`}>
                  <span className="step">{String(index + 1).padStart(2, "0")}</span>
                  <p>
                    <strong>
                      {memberById.get(settlement.fromMemberId)?.name}
                    </strong>{" "}
                    pays{" "}
                    <strong>{memberById.get(settlement.toMemberId)?.name}</strong>
                  </p>
                  <b>{formatMoney(settlement.amountInCents)}</b>
                </li>
              ))}
            </ol>
            <p className="math-note">
              Calculated from integer cents. No floating-point surprises.
            </p>
          </article>
        </div>
      </section>

      <section className="contribute-section" id="contribute">
        <div className="section-heading">
          <div>
            <p className="eyebrow">The next chapter is intentionally open</p>
            <h2>Four features, ready to own.</h2>
          </div>
          <p className="section-intro">
            The foundation works. These user-facing pieces are documented but
            deliberately not implemented, leaving meaningful product work for
            our next contributor.
          </p>
        </div>
        <div className="contribution-grid">
          <ContributionCard
            number="01"
            title="Add an expense"
            description="Design the form for amount, payer, date, description, and who shares the cost."
            skills="Forms · validation · state"
          />
          <ContributionCard
            number="02"
            title="Expense history"
            description="Turn raw expenses into a useful timeline with search, filters, and thoughtful empty states."
            skills="Rendering · filtering · UX"
          />
          <ContributionCard
            number="03"
            title="Manage people"
            description="Create the flow for adding, editing, and safely removing members from a group."
            skills="CRUD · modals · accessibility"
          />
          <ContributionCard
            number="04"
            title="Responsive polish"
            description="Make every view feel considered on a phone, including loading, error, and no-data states."
            skills="CSS · responsive design · QA"
          />
        </div>
        <div className="handoff">
          <p>
            Start with <code>CONTRIBUTING.md</code>
          </p>
          <span>Clear boundaries · acceptance criteria · suggested order</span>
        </div>
      </section>

      <footer>
        <a className="brand" href="#top">
          sum<span>/</span>work
        </a>
        <p>Built together. Settled fairly.</p>
        <span>v0.1 · Manila</span>
      </footer>
    </main>
  );
}
