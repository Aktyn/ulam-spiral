import { UlamSpiral } from "~/components/ulamSpiral"
import styles from "~/styles/main.css"

export function links() {
  return [{ rel: "stylesheet", href: styles }]
}

export default function Index() {
  return <UlamSpiral />
}
