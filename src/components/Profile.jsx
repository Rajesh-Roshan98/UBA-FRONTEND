import React, { useState } from 'react';
import { 
  UserCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Edit2,
  Save,
  X,
  Globe,
  Briefcase
} from 'lucide-react';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Full-stack developer with 5+ years of experience building scalable web applications. Passionate about React and Node.js.',
    jobTitle: 'Senior Software Engineer',
    company: 'TechCorp Inc.',
    website: 'https://alexjohnson.dev',
    joinDate: 'March 2019',
    skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS', 'MongoDB'],
  });

  const [editForm, setEditForm] = useState({ ...profileData });

  const handleEditClick = () => {
    setEditForm({ ...profileData });
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setProfileData({ ...editForm });
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillAdd = (skill) => {
    if (skill && !editForm.skills.includes(skill)) {
      setEditForm(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const handleSkillRemove = (index) => {
    setEditForm(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your personal information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-6">
              {/* Profile Header */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <UserCircle className="w-28 h-28 text-white" />
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition">
                      <Edit2 size={16} />
                    </button>
                  )}
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900">
                  {isEditing ? (
                    <input
                      type="text"
                      name="name"
                      value={editForm.name}
                      onChange={handleInputChange}
                      className="text-center text-xl font-semibold bg-gray-50 border border-gray-300 rounded px-3 py-1"
                    />
                  ) : (
                    profileData.name
                  )}
                </h2>
                <p className="text-gray-600">
                  {isEditing ? (
                    <input
                      type="text"
                      name="jobTitle"
                      value={editForm.jobTitle}
                      onChange={handleInputChange}
                      className="text-center bg-gray-50 border border-gray-300 rounded px-3 py-1 mt-1"
                    />
                  ) : (
                    profileData.jobTitle
                  )}
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center text-gray-700">
                  <Mail size={18} className="text-gray-400 mr-3" />
                  <span className="text-sm">
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-1"
                      />
                    ) : (
                      profileData.email
                    )}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <Phone size={18} className="text-gray-400 mr-3" />
                  <span className="text-sm">
                    {isEditing ? (
                      <input
                        type="text"
                        name="phone"
                        value={editForm.phone}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-1"
                      />
                    ) : (
                      profileData.phone
                    )}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <MapPin size={18} className="text-gray-400 mr-3" />
                  <span className="text-sm">
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={editForm.location}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-1"
                      />
                    ) : (
                      profileData.location
                    )}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <Globe size={18} className="text-gray-400 mr-3" />
                  <span className="text-sm">
                    {isEditing ? (
                      <input
                        type="text"
                        name="website"
                        value={editForm.website}
                        onChange={handleInputChange}
                        className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-1"
                      />
                    ) : (
                      profileData.website
                    )}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-700">
                  <Calendar size={18} className="text-gray-400 mr-3" />
                  <span className="text-sm">Joined {profileData.joinDate}</span>
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing ? (
                <div className="flex space-x-3">
                  <button
                    onClick={handleSaveClick}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                  >
                    <Save size={18} className="mr-2" />
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancelClick}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition flex items-center justify-center"
                  >
                    <X size={18} className="mr-2" />
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleEditClick}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
                >
                  <Edit2 size={18} className="mr-2" />
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio Section */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About Me</h3>
              {isEditing ? (
                <textarea
                  name="bio"
                  value={editForm.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-4"
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">{profileData.bio}</p>
              )}
            </div>

            {/* Skills Section */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
                {isEditing && (
                  <button
                    onClick={() => {
                      const skill = prompt('Enter a new skill:');
                      if (skill) handleSkillAdd(skill);
                    }}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + Add Skill
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {isEditing ? (
                  editForm.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full"
                    >
                      <span className="text-sm font-medium">{skill}</span>
                      <button
                        onClick={() => handleSkillRemove(index)}
                        className="ml-2 text-blue-800 hover:text-blue-900"
                      >
                        ×
                      </button>
                    </div>
                  ))
                ) : (
                  profileData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))
                )}
              </div>
            </div>

            {/* Company Info */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <Briefcase className="text-gray-400 mr-4" />
                  <div>
                    <p className="text-sm text-gray-600">Company</p>
                    <p className="font-medium">
                      {isEditing ? (
                        <input
                          type="text"
                          name="company"
                          value={editForm.company}
                          onChange={handleInputChange}
                          className="bg-white border border-gray-300 rounded px-3 py-1"
                        />
                      ) : (
                        profileData.company
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;