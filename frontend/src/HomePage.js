import CreateNote from "./CreateNote";
import NotesList from "./NotesList";


function HomePage() {
  return (
    <div className="w-100 max-w-4xl mx-auto p-6 lg:p-10">
      <div className="flex flex-col justify-between gap-5">
        <div className="w-full mb-6">
          <CreateNote />
        </div>
        <div className="w-full mb-6">
          <NotesList/>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
