import React from 'react';
import { format, addDays } from 'date-fns';
import { enUS } from 'date-fns/locale';

const Home = () => {
  const today = new Date();
  
  // Generate a week of dates
  const weekDates = Array.from({ length: 7 }).map((_, i) => addDays(today, i));

  return (
    <div className="p-6 pt-10">
      <header className="mb-8">
        <p className="text-gray-500 font-medium">{format(today, 'MMM d, yyyy')}</p>
        <h1 className="text-4xl font-bold text-gray-900 mt-1 tracking-tight">Today</h1>
      </header>

      {/* Date Selector */}
      <div className="flex justify-between items-center mb-8">
        {weekDates.map((date, i) => {
          const isSelected = i === 0; // Just mock first date selected
          return (
            <div key={i} className="flex flex-col items-center">
              <span className={`text-xs mb-2 ${isSelected ? 'text-primary font-medium' : 'text-gray-400'}`}>
                {format(date, 'EEE')}
              </span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                ${isSelected ? 'bg-primary text-white shadow-md shadow-blue-200' : 'text-gray-800'}`}>
                {format(date, 'd')}
              </div>
              {isSelected && <div className="w-1 h-1 rounded-full bg-primary mt-2"></div>}
            </div>
          );
        })}
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {/* Task Item 1 */}
        <div className="flex gap-4 items-start">
          <div className="w-[2px] h-full bg-blue-100 flex flex-col items-center mt-2">
            <div className="w-4 h-4 rounded-full border-2 border-primary bg-white -ml-[7px]"></div>
            <div className="w-[2px] h-16 bg-blue-100"></div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50 flex-1">
            <div className="flex justify-between items-center mb-1">
              <h3 className="font-semibold text-gray-800">Wakeup</h3>
              <span className="text-sm text-gray-400">7:00 AM</span>
            </div>
            <p className="text-sm text-gray-500">Early wakeup from bed and fresh</p>
          </div>
        </div>

        {/* Task Item 2 (Active/Blue like design) */}
        <div className="flex gap-4 items-start">
          <div className="w-[2px] h-full bg-blue-100 flex flex-col items-center mt-2">
             <div className="w-4 h-4 rounded-full border-[3px] border-white bg-primary shadow-sm -ml-[7px]"></div>
             <div className="w-[2px] h-20 bg-blue-100"></div>
          </div>
          <div className="bg-primary text-white rounded-2xl p-5 shadow-lg shadow-blue-200 flex-1">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">Meeting</h3>
              <span className="text-sm text-blue-100">9:00 AM</span>
            </div>
            <p className="text-sm text-blue-100 mb-4">Zoom call, Discuss team task for the day</p>
            <div className="flex justify-between items-center">
               <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2 border-primary bg-gray-200"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-primary bg-gray-300"></div>
                  <div className="w-8 h-8 rounded-full border-2 border-primary bg-gray-400"></div>
               </div>
               <button className="bg-white w-8 h-8 rounded-xl flex items-center justify-center text-primary shadow-sm">
                  ✓
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
