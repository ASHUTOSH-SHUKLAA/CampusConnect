import { Search, Filter, ArrowUpDown } from 'lucide-react';
import Input from '../ui/Input';

const CATEGORIES = [
  'All',
  'Hackathons',
  'Workshops',
  'Cultural & Arts',
  'Sports & Gaming',
  'Club Meetups',
  'Seminars & Talks',
];

export default function EventFilter({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  sortBy,
  setSortBy,
}) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4 mb-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Bar */}
        <div className="w-full md:w-1/2">
          <Input
            placeholder="Search events by title, description, venue..."
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Sort Selector */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 shrink-0">
            Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full md:w-auto rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm p-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="upcoming">Upcoming Date</option>
            <option value="newest">Recently Added</option>
            <option value="capacity">Highest Capacity</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Categories
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
