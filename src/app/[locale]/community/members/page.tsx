import { getMembers } from '@/lib/data';
import Image from 'next/image';

interface Member {
  id: string;
  name: string;
  role: string;
  image?: string;
  bio?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}

function MemberGrid({ members }: { members: Member[] }) {
  if (!members || members.length === 0) {
    return <p>No team members to display.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 my-8">
      {members.map((member) => (
        <div key={member.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          {member.image && (
            <div className="relative h-64 w-full">
              <Image 
                src={member.image} 
                alt={member.name}
                fill
                style={{objectFit: 'cover'}}
              />
            </div>
          )}
          <div className="p-4">
            <h3 className="text-xl font-bold">{member.name}</h3>
            <p className="text-gray-600 mb-2">{member.role}</p>
            {member.bio && <p className="text-sm mb-3">{member.bio}</p>}
            
            {member.socialLinks && (
              <div className="flex space-x-3 mt-3">
                {member.socialLinks.twitter && (
                  <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                    Twitter
                  </a>
                )}
                {member.socialLinks.linkedin && (
                  <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:text-blue-900">
                    LinkedIn
                  </a>
                )}
                {member.socialLinks.github && (
                  <a href={member.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-800 hover:text-black">
                    GitHub
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default async function CommunityPage() {
  const members = await getMembers();
  
  return (
    <div className="mt-16 container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-center">Our Team</h2>
      <MemberGrid members={members} />
    </div>
  );
}