import ListingsPage from "./ListingsPage";

export default function ForSalePage() {
  return (
    <ListingsPage
      pageTitle="Properties For Sale"
      initialFilters={{ status: "For Sale" }}
    />
  );
}
