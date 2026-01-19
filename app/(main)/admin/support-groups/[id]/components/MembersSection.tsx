import { Users } from "lucide-react";
import Image from "next/image";
import { GroupDetail } from "./types";

interface MembersSectionProps {
  members: GroupDetail["members"];
}

export function MembersSection({ members }: MembersSectionProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-primary/20 overflow-hidden">
      <div className="relative p-8 bg-gradient-to-r from-white to-emerald-50/50 border-b border-b-grayBlue/20">
        <Image
          src="/formation/dot-pattern.svg"
          width={120}
          height={120}
          alt=""
          className="absolute top-0 right-0 opacity-30"
        />
        <h3 className="text-xl font-satoshi font-bold text-darkBlue mb-2 flex items-center">
          <Users className="w-6 h-6 mr-2 text-emerald-600" />
          Membres ({members.length})
        </h3>
        <p className="text-gray-600">Participants inscrits à cette formation</p>
      </div>
      <div className="p-6">
        {members.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun membre dans ce groupe</p>
          </div>
        ) : (
          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg border border-gray-100"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {member.user.firstName
                        ? member.user.firstName[0].toUpperCase()
                        : member.user.email[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-satoshi font-medium text-darkBlue">
                      {member.user.firstName && member.user.lastName
                        ? `${member.user.firstName} ${member.user.lastName}`
                        : member.user.email}
                    </h4>
                    <p className="text-sm text-gray-600">{member.user.email}</p>
                    {member.user.lastLoginAt && (
                      <p className="text-xs text-gray-500">
                        Dernière connexion:{" "}
                        {new Date(member.user.lastLoginAt).toLocaleDateString(
                          "fr-FR"
                        )}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Invité le{" "}
                      {new Date(member.invitedAt).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      member.status === "ACTIVE"
                        ? "bg-green-100 text-green-800"
                        : member.status === "INVITED"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {member.status === "ACTIVE"
                      ? "Actif"
                      : member.status === "INVITED"
                      ? "Invité"
                      : "Retiré"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
