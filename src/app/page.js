import Link from "next/link";

const HackSecureHome = () => {
  return (
    <div>
      <div>TODO LIST</div>
      <ul className="ml-4 mt-2">
        <li>IMP --- Instance based Challenges</li>
        <li>Admin Controls</li>
        <li>Admin Users</li>
        <li>Admin Notifications</li>
        <li>Admin Logs</li>

        <li>User Notifications</li>
        <li>User My Team</li>
        <li>User Challenges</li>
        <li>User Leaderboard</li>
        <li>User Teams</li>

        <li className="text-red-500">Make sure joining team has max 5 members</li>
        
      </ul>
    </div>
  );
};

export default HackSecureHome;
