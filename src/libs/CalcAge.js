import { differenceInYears } from "date-fns"

export default function CalcAge(bornDate) {
  const today = new Date()
  return differenceInYears(today, bornDate)
}