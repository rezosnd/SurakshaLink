
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateUserMobile, getUserMobile } from "@/services/firebaseService";
import { Phone } from "lucide-react";
import { toast } from "sonner";

const MobileNumberUpdate = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Load mobile number on component mount and when updated
  useEffect(() => {
    const currentNumber = getUserMobile();
    setMobileNumber(currentNumber);
  }, []);

  const handleSave = () => {
    if (!mobileNumber || mobileNumber.trim() === "") {
      toast.error("Please enter a valid mobile number");
      return;
    }

    if (updateUserMobile(mobileNumber)) {
      toast.success("Mobile number updated successfully");
      setIsEditing(false);
    } else {
      toast.error("Failed to update mobile number");
    }
  };

  const handleCancel = () => {
    setMobileNumber(getUserMobile());
    setIsEditing(false);
  };

  // Handle the input change with immediate visual update
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMobileNumber(value);
  };

  return (
    <div className="p-4 bg-colors-bg--300 border border-primary--600 rounded-md mb-4">
      <h3 className="text-tertiary--500 mb-3 flex items-center gap-2">
        <Phone className="w-5 h-5" />
        Emergency Mobile Number
      </h3>

      {isEditing ? (
        <div className="space-y-2">
          <Input
            type="tel"
            value={mobileNumber}
            onChange={handleInputChange}
            placeholder="Enter your mobile number"
            className="bg-colors-bg--500 border-primary--800 text-cyan-400"
          />
          <div className="flex gap-2">
            <Button 
              onClick={handleSave}
              className="bg-secondary--500 text-colors-bg--300 hover:bg-secondary--700"
              data-augmented-ui="tl-clip br-clip border"
            >
              Save
            </Button>
            <Button 
              onClick={handleCancel}
              variant="outline"
              className="border-primary--800 text-primary--300"
              data-augmented-ui="tr-clip bl-clip border"
            >
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center">
          <p className="text-[#D946EF] font-medium">
            {mobileNumber ? mobileNumber : "No mobile number set"}
          </p>
          <Button 
            onClick={() => setIsEditing(true)} 
            size="sm"
            className="bg-tertiary--800 text-tertiary--300 hover:bg-tertiary--700"
            data-augmented-ui="tr-clip bl-clip border"
          >
            {mobileNumber ? "Change" : "Add Number"}
          </Button>
        </div>
      )}
      <p className="mt-2 text-xs text-primary--300">
        Your mobile number will be included in emergency alerts to help contacts reach you.
      </p>
    </div>
  );
};

export default MobileNumberUpdate;
