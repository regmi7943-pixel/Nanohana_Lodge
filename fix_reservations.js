const fs = require('fs');
const path = require('path');
const file = path.join('app', '(public)', 'reservations', 'ReservationsClient.tsx');
let content = fs.readFileSync(file, 'utf8');

const calendarContent = `
              <div className="bg-white border border-earth/10 p-4 lg:p-6 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between mb-6 px-1 lg:px-0">
                  <button 
                    onClick={(e) => { e.preventDefault(); setCalendarDate(new Date(currentYear, currentMonth - 1, 1)) }} 
                    disabled={currentYear === new Date().getFullYear() && currentMonth === new Date().getMonth()}
                    className={\`p-3 lg:p-2 rounded-full transition-colors \${currentYear === new Date().getFullYear() && currentMonth === new Date().getMonth() ? 'text-earth/20 cursor-not-allowed' : 'text-earth/70 hover:text-earth hover:bg-earth/5'}\`}
                  >
                    <ChevronLeft className="w-6 h-6 lg:w-5 lg:h-5" />
                  </button>
                  <h3 className="font-serif text-lg font-medium text-earth">
                    {monthNames[currentMonth]} {currentYear}
                  </h3>
                  <button onClick={(e) => { e.preventDefault(); setCalendarDate(new Date(currentYear, currentMonth + 1, 1)) }} className="p-3 lg:p-2 hover:bg-earth/5 rounded-full transition-colors text-earth/70 hover:text-earth">
                    <ChevronRight className="w-6 h-6 lg:w-5 lg:h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-7 gap-y-2 gap-x-0 mb-2">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                    <div key={d} className="text-center text-[10px] font-bold text-earth/40 uppercase tracking-wider py-2">
                      {d}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 gap-y-2 gap-x-0">
                  {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                    <div key={\`empty-\${i}\`} className="aspect-square" />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const d = new Date(currentYear, currentMonth, day);
                    const today = new Date();
                    today.setHours(0,0,0,0);
                    const isPast = d < today;
                    
                    const avail = getAvailableRoomsOnDate(d, selectedCatId);
                    const isFullyBooked = avail === 0;
                    
                    let isCheckIn = false;
                    let isCheckOut = false;
                    if (checkInDate && d.getTime() === checkInDate.getTime()) isCheckIn = true;
                    if (checkOutDate && d.getTime() === checkOutDate.getTime()) isCheckOut = true;
                    const selected = isCheckIn || isCheckOut;
                    const inRange = isDateInRange(day);
                    
                    return (
                      <button
                        key={day}
                        onClick={(e) => { e.preventDefault(); handleDateClick(day); }}
                        disabled={isPast || isFullyBooked}
                        className={\`relative aspect-square flex flex-col items-center justify-center text-sm transition-all w-full
                          \${isPast ? 'text-earth/20 cursor-not-allowed rounded-full' : ''}
                          \${!isPast && isFullyBooked ? 'bg-red-50 text-red-300 line-through cursor-not-allowed rounded-full mx-1 w-[calc(100%-8px)]' : ''}
                          \${!isPast && !isFullyBooked && !selected && !inRange ? 'hover:bg-earth/5 text-earth/80 rounded-full mx-1 w-[calc(100%-8px)]' : ''}
                          \${inRange ? 'bg-nanohana/20 text-earth rounded-none' : ''}
                          \${isCheckIn && checkOutDate ? 'bg-nanohana text-earth font-bold shadow-md rounded-l-full rounded-r-none' : ''}
                          \${isCheckOut ? 'bg-nanohana text-earth font-bold shadow-md rounded-r-full rounded-l-none' : ''}
                          \${selected && !checkOutDate ? 'bg-nanohana text-earth font-bold shadow-md rounded-full mx-1 w-[calc(100%-8px)]' : ''}
                        \`}
                      >
                        <span>{day}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-earth/10 flex items-center justify-between text-xs text-earth/60 font-mono">
                  <span><span className="inline-block w-3 h-3 bg-nanohana rounded-sm mr-1"></span> Selected</span>
                  <span><span className="inline-block w-3 h-3 bg-nanohana/20 rounded-sm mr-1"></span> In Range</span>
                  <span><span className="inline-block w-3 h-3 bg-red-50 border border-red-100 rounded-sm mr-1"></span> Booked</span>
                </div>
                {checkInDate && !checkOutDate && (
                  <div className="mt-6 text-center animate-pulse text-nanohana font-medium text-sm">
                    Select your check-out date
                  </div>
                )}
                {checkInDate && checkOutDate && (
                  <button onClick={() => goToStep('options', 1)} className="mt-6 w-full py-3 bg-nanohana text-earth font-bold rounded-lg shadow hover:bg-nanohana/90 transition-all flex justify-center items-center gap-2">
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
`;

const optionsContent = `
                  <div className="space-y-5 bg-white border border-earth/10 rounded-2xl p-4 lg:p-6 shadow-sm">
                    <button onClick={() => goToStep('calendar', -1)} className="text-xs text-earth/60 hover:text-earth mb-2 flex items-center gap-1 transition-colors">
                      <ChevronLeft className="w-3 h-3" /> Back to dates
                    </button>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="text-[10px] font-mono uppercase tracking-wider text-earth/80 block mb-1">
                          Choose Your Room
                        </label>
                        <select
                          value={selectedCatId}
                          onChange={(e) => setSelectedCatId(e.target.value)}
                          className="w-full bg-cream/30 rounded-lg border border-earth/15 px-3 py-3 text-sm focus:outline-none focus:border-phewa text-earth shadow-sm"
                        >
                          {defaultRooms.map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-mono uppercase tracking-wider text-earth/80 block mb-1">
                          Rooms Requested
                        </label>
                        <select
                          value={roomsCount}
                          onChange={(e) => setRoomsCount(parseInt(e.target.value))}
                          className="w-full bg-cream/30 rounded-lg border border-earth/15 px-3 py-3 text-sm focus:outline-none focus:border-phewa text-earth shadow-sm"
                        >
                          <option value={1}>1 Room</option>
                          <option value={2}>2 Rooms</option>
                          <option value={3}>3 Rooms</option>
                          <option value={4}>4 Rooms</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-mono uppercase tracking-wider text-earth/80 block mb-1">
                          Travelers
                        </label>
                        <select
                          value={guestsCount}
                          onChange={(e) => setGuestsCount(parseInt(e.target.value))}
                          className="w-full bg-cream/30 rounded-lg border border-earth/15 px-3 py-3 text-sm focus:outline-none focus:border-phewa text-earth shadow-sm"
                        >
                          <option value={1}>1 Adult</option>
                          <option value={2}>2 Adults</option>
                          <option value={3}>3 Adults / Family</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 text-xs text-earth/60 bg-cream/30 p-3 border border-earth/10 rounded-lg">
                      <Calendar className="w-4 h-4 text-nanohana flex-shrink-0" />
                      <span>
                        {checkInDate ? formatDate(checkInDate) : 'Select Check-in'} 
                        {' '}→{' '} 
                        {checkOutDate ? formatDate(checkOutDate) : 'Select Check-out'}
                      </span>
                    </div>

                    {isFullyBooked ? (
                      <div className="p-5 rounded-xl bg-red-50 border border-red-200 flex gap-3 text-red-800 mt-4">
                        <ShieldAlert className="w-6 h-6 flex-shrink-0 text-red-500" />
                        <div>
                          <h4 className="font-bold text-sm">Fully Booked</h4>
                          <p className="text-xs opacity-80 mt-1">We're sorry, but the selected dates are completely booked for this room type. Please try different dates or another category.</p>
                        </div>
                      </div>
                    ) : roomsCount > minAvailable ? (
                      <div className="p-5 rounded-xl bg-amber-50 border border-amber-200 space-y-4 text-amber-900 mt-4">
                        <div className="flex gap-3">
                          <AlertCircle className="w-6 h-6 flex-shrink-0 text-amber-500" />
                          <div>
                            <h4 className="font-bold text-sm">Limited Availability</h4>
                            <p className="text-xs opacity-90 mt-1">
                              You requested {roomsCount} room(s), but only <strong>{minAvailable} room(s)</strong> are available during your selected dates.
                            </p>
                          </div>
                        </div>
                        <div className="bg-white/60 p-3 rounded-lg text-xs border border-amber-100 flex flex-col gap-2">
                          <p><strong>Note:</strong> You could ask for an extra bed if you need more space, or reduce your room count to proceed.</p>
                          <div className="flex gap-2 mt-1">
                            <button onClick={() => setRoomsCount(minAvailable)} className="px-4 py-2 bg-amber-500 text-white font-bold rounded shadow-sm hover:bg-amber-600 transition-colors">
                              Change to {minAvailable} Room(s)
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-5 rounded-xl bg-forest/5 border border-forest/20 space-y-4 mt-4">
                        <div className="flex items-center gap-3 border-b border-earth/10 pb-3">
                          <CheckCircle2 className="w-6 h-6 text-forest flex-shrink-0" />
                          <div>
                            <h3 className="font-serif text-base font-bold text-earth">Available for Booking!</h3>
                            <p className="text-xs text-earth/70">Your requested {roomsCount} room(s) are available.</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-earth/5">
                          <div>
                            <span className="text-[10px] text-earth/50 uppercase tracking-widest font-mono block">Total Rate</span>
                            <div className="font-serif text-xl font-bold text-nanohana">\${getCalculatedPrice()}</div>
                          </div>
                          <button
                            onClick={() => goToStep('details', 1)}
                            className="px-5 py-2.5 rounded-lg bg-nanohana text-earth font-sans text-xs font-semibold hover:bg-nanohana/90 transition-colors"
                          >
                            Lock in Reservation
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
`;

const detailsContent = `
                  <div className="bg-white border border-earth/10 rounded-2xl p-4 lg:p-6 shadow-sm flex flex-col h-full">
                    <div className="mb-6 pb-6 border-b border-earth/10">
                      <button onClick={() => goToStep('options', -1)} className="text-xs text-earth/60 hover:text-earth mb-4 flex items-center gap-1 transition-colors">
                        <ChevronLeft className="w-3 h-3" /> Back to options
                      </button>
                      <h3 className="font-serif text-xl font-bold text-earth">Guest Details</h3>
                      <p className="text-xs text-earth/60 mt-1">Please provide your contact information to send the booking request.</p>
                    </div>

                    <form 
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setIsSubmitting(true);
                        
                        const newReq = {
                          id: 'REQ-' + Date.now().toString().slice(-6),
                          guestName,
                          email: guestEmail,
                          phone: guestPhone,
                          roomType: selectedRoomDetails?.name || 'Unknown Room',
                          checkIn: checkInDate ? formatDate(checkInDate) : '',
                          checkOut: checkOutDate ? formatDate(checkOutDate) : '',
                          guestsCount,
                          roomsCount,
                          totalPrice: getCalculatedPrice(),
                          status: 'Pending',
                          dateRequested: new Date().toISOString()
                        };

                        const updatedList = [...bookingRequestsList, newReq];
                        setBookingRequestsList(updatedList);
                        await updateContent('global', 'booking_requests', JSON.stringify(updatedList));

                        setIsSubmitting(false);
                        goToStep('success', 1);
                      }}
                      className="flex flex-col flex-grow justify-between space-y-6"
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="text-[10px] font-mono uppercase tracking-wider text-earth/80 block mb-1">Full Name</label>
                          <input type="text" required value={guestName} onChange={e => setGuestName(e.target.value)} className="w-full bg-cream/50 rounded-lg border border-earth/15 px-3 py-2.5 text-sm focus:outline-none focus:border-phewa" placeholder="John Doe" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-mono uppercase tracking-wider text-earth/80 block mb-1">Email</label>
                            <input type="email" required value={guestEmail} onChange={e => setGuestEmail(e.target.value)} className="w-full bg-cream/50 rounded-lg border border-earth/15 px-3 py-2.5 text-sm focus:outline-none focus:border-phewa" placeholder="john@example.com" />
                          </div>
                          <div>
                            <label className="text-[10px] font-mono uppercase tracking-wider text-earth/80 block mb-1">Phone</label>
                            <input type="tel" required value={guestPhone} onChange={e => setGuestPhone(e.target.value)} className="w-full bg-cream/50 rounded-lg border border-earth/15 px-3 py-2.5 text-sm focus:outline-none focus:border-phewa" placeholder="+1 234 567 890" />
                          </div>
                        </div>
                        
                        <div className="bg-cream/30 p-4 rounded-lg border border-earth/5 mt-4">
                          <h4 className="text-[10px] font-mono uppercase tracking-wider text-earth/80 mb-2">Booking Summary</h4>
                          <div className="text-sm space-y-1 text-earth">
                            <p><strong>Room:</strong> {selectedRoomDetails?.name}</p>
                            <p><strong>Dates:</strong> {checkInDate && formatDate(checkInDate)} to {checkOutDate && formatDate(checkOutDate)}</p>
                            <p><strong>Configuration:</strong> {roomsCount} Room(s), {guestsCount} Traveler(s)</p>
                            <div className="mt-2 pt-2 border-t border-earth/10 flex justify-between items-center">
                              <span className="font-bold">Estimated Total:</span>
                              <span className="font-serif font-bold text-lg text-nanohana">\${getCalculatedPrice()}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 bg-forest text-cream font-sans text-xs tracking-wider uppercase font-semibold rounded-xl hover:bg-forest/90 transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                      >
                        {isSubmitting ? 'Sending Request...' : 'Send Booking Request'}
                      </button>
                    </form>
                  </div>
`;

const successContent = `
                  <div className="bg-forest/5 border border-forest/20 rounded-2xl p-8 flex flex-col items-center justify-center text-center h-full">
                    <div className="w-16 h-16 bg-forest rounded-full flex items-center justify-center text-cream mb-6">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold text-earth mb-2">Booking Request Sent!</h3>
                    <p className="text-sm text-earth/70 max-w-[300px] mx-auto leading-relaxed">
                      Thank you, {guestName}. Your reservation request for {roomsCount} room(s) has been securely transmitted.
                    </p>
                    <p className="text-sm text-earth/70 max-w-[300px] mx-auto leading-relaxed mt-4">
                      We will review the availability and send you a confirmation email at <strong>{guestEmail}</strong> or call you shortly.
                    </p>
                    <button 
                      onClick={() => {
                        setCheckInDate(null);
                        setCheckOutDate(null);
                        goToStep('calendar', -1);
                      }} 
                      className="mt-8 px-6 py-2.5 border border-earth/20 rounded-lg text-xs font-semibold text-earth hover:bg-earth/5 transition-colors"
                    >
                      Book Another Room
                    </button>
                  </div>
`;

content = content.replace('${calendarContent}', calendarContent);
content = content.replace('${optionsContent}', optionsContent);
content = content.replace('${detailsContent}', detailsContent);
content = content.replace('${successContent}', successContent);

fs.writeFileSync(file, content);
console.log("Fixed ReservationsClient.tsx variables successfully");
