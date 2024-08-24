import { Link } from "react-router-dom";
import { Participant } from "../hooks";

export const ExpenseCard = ({ expenseId,description, totalAmount, payerName, createdAt, participants }: {
  expenseId: string,
  description: string,
  totalAmount: number,
  payerName: string,
  createdAt: string,
  participants: Participant[]
}) => {
  return (
    <div className="mx-2 bg-white shadow-lg rounded-lg overflow-hidden my-6">
      <div className="px-6 py-2">
        <h3 className="text-xl font-bold mb-2 [text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]">{description}</h3>
        <p className="text-gray-700">Total Amount: ${totalAmount}</p>
        <div className="mt-4 flex flex-row justify-start">
          <h4 className="text-md font-semibold">Payer:&nbsp;</h4>
          <p className="text-gray-800">{payerName}</p>
        </div>
        <div className="mt-4 flex flex-row justify-start">
          <p className="text-sm font-semibold text-gray-600">Created:&nbsp;</p>
          <p className="text-sm text-gray-400">{`${new Date(createdAt).getDate()}-${new Date(createdAt).getMonth()}-${new Date(createdAt).getFullYear()}  ${new Date(createdAt).getHours()}:${new Date(createdAt).getMinutes()}`}</p>
        </div>
        <div className="mt-4">
          <h4 className="text-md font-semibold">Participants:</h4>
          <ul className="list-disc pl-5">
            {participants.map((participant) => (
              <li key={participant.id} className="text-gray-800 mt-2">
                <p>{participant.user.name} - Owes: ₹{participant.amountOwed}</p>
                <p className="text-sm text-gray-600">
                  Status: {participant.settled ? 'Settled' : 'Not Settled'}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex felx-row justify-end">
          <Link to={`/expenses/${expenseId}`}>
            <button type="button" className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">View Expense</button>
          </Link>
        </div>
      </div>
    </div>
  );
}