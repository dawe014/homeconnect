import ListingsPage from "./ListingsPage";

export default function ForRentPage() {
  return (
    <ListingsPage
      pageTitle="Properties For Rent"
      initialFilters={{ status: "For Rent" }}
    />
  );
}
