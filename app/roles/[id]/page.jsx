import { RoleDetailsPage } from "./coid";

export default function SingleRole({ params }) {
  return (
    <>
      <RoleDetailsPage id={params.id} />
    </>
  );
}
