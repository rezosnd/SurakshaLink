
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { toast } from "sonner";
import { saveCodeWords } from "@/utils/storageService";

interface CodeWordInputProps {
  codeWords: string[];
  setCodeWords: React.Dispatch<React.SetStateAction<string[]>>;
}

const CodeWordInput = ({ codeWords, setCodeWords }: CodeWordInputProps) => {
  const [newCodeWord, setNewCodeWord] = useState("");

  const addCodeWord = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newCodeWord.trim()) {
      toast.error("Please enter a code word");
      return;
    }
    
    if (codeWords.includes(newCodeWord.trim())) {
      toast.error("This code word already exists");
      return;
    }
    
    const updatedCodeWords = [...codeWords, newCodeWord.trim()];
    setCodeWords(updatedCodeWords);
    saveCodeWords(updatedCodeWords);
    setNewCodeWord("");
    toast.success("Code word added");
  };

  const removeCodeWord = (wordToRemove: string) => {
    const updatedCodeWords = codeWords.filter(word => word !== wordToRemove);
    setCodeWords(updatedCodeWords);
    saveCodeWords(updatedCodeWords);
    toast.info("Code word removed");
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-medium">Your Code Words</h3>
      <p className="text-muted-foreground">
        Add unique words or phrases that will trigger an alert when spoken
      </p>
      
      <form onSubmit={addCodeWord} className="flex gap-2">
        <Input
          value={newCodeWord}
          onChange={(e) => setNewCodeWord(e.target.value)}
          placeholder="Add a code word (e.g. 'pineapple')"
          className="flex-1"
        />
        <Button type="submit">Add</Button>
      </form>
      
      {codeWords.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {codeWords.map((word) => (
            <div key={word} className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
              {word}
              <button
                onClick={() => removeCodeWord(word)}
                className="ml-1 p-0.5 rounded-full hover:bg-blue-200"
                aria-label="Remove code word"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="italic text-muted-foreground">No code words added yet</p>
      )}
    </div>
  );
};

export default CodeWordInput;
