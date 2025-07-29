import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Connecting Helpers with Those in Need
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
            HelpBridge is a platform that connects donors who want to help with 
            needers who require assistance. Join our community today and make a difference!
          </p>
          <div className="mt-10 flex justify-center">
            <div className="rounded-md shadow">
              <Link
                to="/auth?type=register"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-dark md:py-4 md:text-lg md:px-10"
              >
                Get Started
              </Link>
            </div>
            <div className="ml-3 rounded-md shadow">
              <Link
                to="/leaderboard"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
              >
                View Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-primary font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              How HelpBridge Works
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: 'Create Requests',
                  description: 'Need help? Create a request specifying what you need and donors can offer assistance.',
                },
                {
                  title: 'Offer Help',
                  description: 'As a donor, browse requests and offer help to those in need in your community.',
                },
                {
                  title: 'Rate Interactions',
                  description: 'After completing a request, rate the interaction to help maintain a trustworthy community.',
                },
                {
                  title: 'Build Reputation',
                  description: 'Donors earn points for helping, building their reputation on the leaderboard.',
                },
                {
                  title: 'Fraud Prevention',
                  description: 'Report fraudulent activities to protect the community from bad actors.',
                },
                {
                  title: 'Community Leaderboard',
                  description: 'See top donors based on their contributions and ratings.',
                },
              ].map((feature, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}