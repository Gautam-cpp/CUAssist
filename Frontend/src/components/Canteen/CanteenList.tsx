import React from 'react';
import { Link } from 'react-router-dom';
import { UtensilsCrossed, Star, Clock, Users } from 'lucide-react';

const canteens = [
    { name: 'Zakir-A', description: 'Traditional Indian and Continental food', timing: '7 AM - 10 PM' },
    { name: 'Zakir-B', description: 'Fast food and snacks', timing: '8 AM - 11 PM' },
    { name: 'Zakir-C', description: 'Coffee, tea, and light snacks', timing: '6 AM - 9 PM' },
    { name: 'Zakir-D', description: 'Fresh juices and healthy drinks', timing: '7 AM - 8 PM' },
    { name: 'NC1', description: 'Multi-cuisine with daily specials', timing: '7 AM - 10 PM' },
    { name: 'NC2', description: 'Variety of vegetarian and non-vegetarian dishes', timing: '8 AM - 11 PM' },
    { name: 'NC3', description: 'North Indian specialties', timing: '7 AM - 10 PM' },
    { name: 'NC4', description: 'South Indian delicacies', timing: '8 AM - 11 PM' },
    { name: 'NC5', description: 'Chinese and Asian cuisine', timing: '7 AM - 10 PM' },
    { name: 'NC6', description: 'Desserts and sweet treats', timing: '8 AM - 11 PM' },
    { name: 'Punjabi Rasoi', description: 'Beverages and quick bites', timing: '7 AM - 10 PM' },
    { name: 'Ketchup Cafe', description: 'Specialty dishes and chef\'s recommendations', timing: '8 AM - 11 PM' }

];

const CanteenList: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Campus Canteens</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {canteens.map((canteen) => (
          <Link
            key={canteen.name}
            to={`/canteens/${canteen.name}`}
            className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <UtensilsCrossed className="h-6 w-6 text-orange-600" />
                </div>
                <div className="flex items-center space-x-1 text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-medium text-gray-700">4.5</span>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition-colors mb-2">
                {canteen.name}
              </h3>
              
              <p className="text-gray-600 text-sm mb-4">{canteen.description}</p>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  {canteen.timing}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-2" />
                  120+ reviews
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Featured Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Popular Today</h2>
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Main Canteen Special</h3>
              <p className="text-orange-100 mb-4">
                Try today's special: Butter Chicken with Naan - Student favorite!
              </p>
              <Link
                to="/canteens/Main Canteen"
                className="inline-flex items-center px-6 py-3 bg-white text-orange-600 rounded-lg font-medium hover:bg-orange-50 transition-colors"
              >
                View Menu
              </Link>
            </div>
            <UtensilsCrossed className="h-16 w-16 text-orange-200" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanteenList;