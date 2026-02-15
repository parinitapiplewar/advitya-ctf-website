export default function RulesPage() {
  const rules = [
    "Participants must not attack, exploit, or disrupt the CTF platform infrastructure, servers, or network.",
    "Denial-of-Service (DoS/DDoS), brute-force attacks, automated scanning, or traffic flooding against the platform are strictly prohibited.",
    "Flags must not be shared, traded, or leaked between teams or participants.",
    "Teams must only exploit vulnerabilities within the intended challenge scope.",
    "Any attempt to access other teams’ accounts, flags, or private data is forbidden.",
    "Use of automated flag submission scripts or bots is not allowed unless explicitly permitted.",
    "Respect all participants and organizers; abusive or inappropriate behavior will not be tolerated.",
    "Any unintended vulnerabilities discovered in the platform must be reported to organizers immediately.",
    "Organizers reserve the right to disqualify any team for unfair advantage, cheating, or rule violations.",
    "All decisions by the organizers are final and binding."
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-gray-200 px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-cyan-400 mb-2">
          CTF Rules
        </h1>
        <p className="text-gray-400 mb-8">
          Please read and follow all rules carefully during the CTF event.
        </p>

        <ul className="space-y-4">
          {rules.map((rule, index) => (
            <li
              key={index}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4"
            >
              <span className="text-cyan-400 font-semibold mr-2">
                {index + 1}.
              </span>
              {rule}
            </li>
          ))}
        </ul>

        <div className="mt-10 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
          Violation of any rule may result in immediate disqualification and removal from the competition.
        </div>
      </div>
    </div>
  );
}
