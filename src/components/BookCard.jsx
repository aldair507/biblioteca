import { useLibrary } from "../context/LibraryContext";
import { Card, CardContent } from "./ui/card"; 
 
export default function BookCard() {
    const { books } = useLibrary();
  return (
   <BookTable books={books} /> 
  );
}
   
   