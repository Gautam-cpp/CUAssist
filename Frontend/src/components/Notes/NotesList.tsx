import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Upload, Clock, CheckCircle } from 'lucide-react';
import { subjects } from '../../lib/subjects';

const NotesList: React.FC = () => {
  const [selectedSemester, setSelectedSemester] = useState<number>(1);

  const filteredSubjects = subjects.filter(subject =>
    subject.semester.includes(selectedSemester)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Study Notes</h1>
        <div className="flex space-x-4">
          <Link
            to="/notes/upload"
            className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center space-x-2"
          >
            <Upload className="h-5 w-5" />
            <span>Upload Notes</span>
          </Link>
          <Link
            to="/notes/my-uploads"
            className="border border-red-600 text-red-600 px-6 py-3 rounded-lg hover:bg-red-50 transition-colors font-medium flex items-center space-x-2"
          >
            <Clock className="h-5 w-5" />
            <span>My Uploads</span>
          </Link>
        </div>
      </div>

      {/* Semester Filter */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Semester</h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((semester) => (
            <button
              key={semester}
              onClick={() => setSelectedSemester(semester)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedSemester === semester
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Sem {semester}
            </button>
          ))}
        </div>
      </div>

      {/* Subjects Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Semester {selectedSemester} Subjects
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject) => (
            <Link
              key={`${subject.code}-${selectedSemester}`}
              to={`/subject/${selectedSemester}/${subject.code}`}
              className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-red-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-red-600" />
                </div>
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-1" />
                  <span className="text-sm font-medium">Available</span>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors mb-2">
                {subject.name}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4">
                Course Code: {subject.code}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Notes available</span>
                <span className="text-red-600 font-medium group-hover:text-red-700">
                  Browse →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {filteredSubjects.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-4" />
          <p className="text-gray-600">No subjects available for Semester {selectedSemester}</p>
        </div>
      )}

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-4">Contribute to the Community!</h3>
        <p className="text-red-100 mb-6">
          Share your notes and help fellow students succeed. Your contributions make a difference.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Notes', value: '1,200+' },
            { label: 'Contributors', value: '350+' },
            { label: 'Downloads', value: '25K+' },
            { label: 'Subjects', value: '45+' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-red-100 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotesList;