import { GroupDetail } from "./types";
import { MembersSection } from "./MembersSection";
import { SupportsSection } from "./SupportsSection";

interface GroupFormProps {
  group: GroupDetail;
  onManageSupports: () => void;
}

export function GroupForm({ group, onManageSupports }: GroupFormProps) {
  return (
    <div className="lg:col-span-2 space-y-6">
      <MembersSection members={group.members} />
      <SupportsSection
        supports={group.training.supports}
        onManageSupports={onManageSupports}
      />
    </div>
  );
}
