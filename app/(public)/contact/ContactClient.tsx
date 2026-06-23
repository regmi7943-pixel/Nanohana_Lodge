'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Mail,
  MapPin,
  Compass,
  Phone,
  Facebook,
  Clock,
  Globe2,
  CheckCircle2,
  AlertCircle,
  Bus,
  Plane,
  Footprints,
  Navigation
} from 'lucide-react';
import EditableText from '@/components/EditableText';
import EditableImage from '@/components/EditableImage';
import toast from 'react-hot-toast';
import { submitContactForm } from '@/app/actions/submitContactForm';

export default function ContactClient({ content = [], editMode = false }: { content?: any[], editMode?: boolean }) {
  const getText = React.useCallback((key: string) => content.find((c: any) => c.key === key)?.value, [content]);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', checkin: '', checkout: '', rooms: 'Standard Room', message: '', discovery: 'Search Engine'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill out the name, email, and message fields before sending.');
      return;
    }
    
    setFormLoading(true);
    try {
      const res = await submitContactForm(formData);
      if (res.error) {
        toast.error(res.error);
      } else {
        setFormSubmitted(true);
        toast.success('Message sent successfully!');
      }
    } catch (err: any) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div id="contact-page" className="w-full">
      <section id="contact-hero" className="relative h-[55vh] min-h-[380px] w-full flex items-center justify-center">
        <EditableImage page="contact" contentKey="contact_hero_bg" defaultSrc="/story_home.jpg" currentSrc={getText('contact_hero_bg')} editMode={editMode} alt="Lodge garden entrance" fill priority sizes="100vw" className="object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-forest/50 mix-blend-multiply pointer-events-none" />
        <div className="relative z-10 text-center px-5 text-cream max-w-[800px] pt-16">
          <EditableText as="span" page="contact" contentKey="contact_hero_eyebrow" defaultText="Contact & Location" currentText={getText('contact_hero_eyebrow')} editMode={editMode} className="text-xs font-mono uppercase tracking-[0.2em] text-cream/70 block mb-2" />
          <EditableText as="h1" page="contact" contentKey="contact_hero_title" defaultText="Come find us in Lakeside." currentText={getText('contact_hero_title')} editMode={editMode} className="font-serif text-4xl sm:text-5xl font-medium tracking-tight mb-4" />
          <EditableText as="p" page="contact" contentKey="contact_hero_desc" defaultText="300 metres from Phewa Lake, directly next to Sahid Chok bus stop, and opposite the owner's quiet family home." currentText={getText('contact_hero_desc')} editMode={editMode} className="text-cream/90 text-sm max-w-[550px] mx-auto leading-relaxed" />
        </div>
      </section>

      <section id="contact-split" className="bg-cream py-20 text-earth">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div id="contact-form-block" className="lg:col-span-7 bg-cream border border-earth/10 rounded-2xl p-6 sm:p-10 shadow-sm space-y-6">
            <EditableText as="h2" page="contact" contentKey="contact_form_title" defaultText="Send us a message" currentText={getText('contact_form_title')} editMode={editMode} className="font-serif text-3xl font-medium mb-2 text-earth" />
            <EditableText as="p" page="contact" contentKey="contact_form_desc" defaultText="We coordinate bookings and custom arrangements directly. Standard response turnouts take less than 3 hours." currentText={getText('contact_form_desc')} editMode={editMode} className="text-xs sm:text-sm text-earth/75 leading-relaxed" />

            {formSubmitted ? (
              <div id="submit-success" className="p-6 rounded-xl bg-forest/10 border border-forest/30 space-y-4 text-center animate-fade-in my-6">
                <CheckCircle2 className="w-12 h-12 text-forest mx-auto" />
                <h3 className="font-serif text-2xl text-forest font-bold">Dhanyabad! (Thank you)</h3>
                <p className="text-sm text-earth/80 max-w-[450px] mx-auto leading-relaxed">
                  We have received your request for a <strong>{formData.rooms}</strong>. Our front desk lead Rabin or owner Kul Bahadur will reach back to <strong>{formData.email}</strong> shortly.
                </p>
                <button onClick={() => setFormSubmitted(false)} className="px-6 py-2 rounded-full bg-forest text-cream font-sans text-xs font-semibold hover:bg-forest/90 transition-colors">
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 my-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="text-[10px] font-mono uppercase tracking-wider text-earth/80 block mb-1">Full Name *</label>
                    <input id="name" type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="e.g. Robin Green" required className="w-full bg-cream rounded-lg border border-earth/15 px-3 py-2 text-sm focus:outline-none focus:border-phewa text-earth" />
                  </div>
                  <div>
                    <label htmlFor="email" className="text-[10px] font-mono uppercase tracking-wider text-earth/80 block mb-1">Email *</label>
                    <input id="email" type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="e.g. robin@gmail.com" required className="w-full bg-cream rounded-lg border border-earth/15 px-3 py-2 text-sm focus:outline-none focus:border-phewa text-earth" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="checkin" className="text-[10px] font-mono uppercase tracking-wider text-earth/80 block mb-1">Check-in Date (Optional)</label>
                    <input id="checkin" type="date" name="checkin" value={formData.checkin} onChange={handleInputChange} className="w-full bg-cream rounded-lg border border-earth/15 px-3 py-2 text-sm focus:outline-none focus:border-phewa text-earth" />
                  </div>
                  <div>
                    <label htmlFor="checkout" className="text-[10px] font-mono uppercase tracking-wider text-earth/80 block mb-1">Check-out Date (Optional)</label>
                    <input id="checkout" type="date" name="checkout" value={formData.checkout} onChange={handleInputChange} className="w-full bg-cream rounded-lg border border-earth/15 px-3 py-2 text-sm focus:outline-none focus:border-phewa text-earth" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="rooms" className="text-[10px] font-mono uppercase tracking-wider text-earth/80 block mb-1">Preferred Room Type</label>
                    <select id="rooms" name="rooms" value={formData.rooms} onChange={handleInputChange} className="w-full bg-cream rounded-lg border border-earth/15 px-3 py-2 text-sm focus:outline-none focus:border-phewa text-earth">
                      <option>Standard Room</option>
                      <option>Standard Garden View Room</option>
                      <option>Deluxe Terrace Room</option>
                      <option>Family / Triple Room</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="discovery" className="text-[10px] font-mono uppercase tracking-wider text-earth/80 block mb-1">How did you find us?</label>
                    <select id="discovery" name="discovery" value={formData.discovery} onChange={handleInputChange} className="w-full bg-cream rounded-lg border border-earth/15 px-3 py-2 text-sm focus:outline-none focus:border-phewa text-earth">
                      <option>Search Engine</option>
                      <option>TripAdvisor Recommendation</option>
                      <option>Booking.com or Agoda</option>
                      <option>Friends / Word of Mouth</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="text-[10px] font-mono uppercase tracking-wider text-earth/80 block mb-1">Your Message / Special Requests *</label>
                  <textarea id="message" name="message" rows={4} value={formData.message} onChange={handleInputChange} placeholder="Tell us about your flight time, your trek plans, or extra bedding needs..." required className="w-full bg-cream rounded-lg border border-earth/15 px-3 py-2 text-sm focus:outline-none focus:border-phewa text-earth" />
                </div>

                <div className="pt-2">
                  <button type="submit" id="submit-message-btn" disabled={formLoading} className="w-full py-3 bg-nanohana text-earth font-sans text-sm font-semibold rounded-full hover:bg-nanohana/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                    {formLoading ? 'Sending Dispatch...' : 'Send Message →'}
                  </button>
                  <p className="text-[10px] text-earth/60 text-center mt-3 block font-mono">
                    * Booking via this form does not occupy credit cards. Payment is transacted at checkout.
                  </p>
                </div>
              </form>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6 w-full">
            <div className="bg-cream border border-earth/10 rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm text-sm">
              <EditableText as="h3" page="contact" contentKey="contact_direct_registry" defaultText="Direct Registry" currentText={getText('contact_direct_registry')} editMode={editMode} className="font-serif text-xl font-bold text-earth border-b border-earth/10 pb-2" />
              <ul className="space-y-3.5 list-none my-0 pl-0 text-earth/80">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-5 h-5 text-phewa flex-shrink-0 mt-0.5" />
                  <EditableText as="span" page="contact" contentKey="contact_address" defaultText="Address: Ammat, Lakeside Street No. 4, Pokhara 33411, Nepal" currentText={getText('contact_address')} editMode={editMode} />
                </li>
                <li className="flex items-start gap-2.5">
                  <Compass className="w-5 h-5 text-phewa flex-shrink-0 mt-0.5" />
                  <EditableText as="span" page="contact" contentKey="contact_geographics" defaultText="Geographics: 28.20403° N, 83.96605° E" currentText={getText('contact_geographics')} editMode={editMode} />
                </li>
                <li className="flex items-start gap-2.5">
                  <Phone className="w-5 h-5 text-phewa flex-shrink-0 mt-0.5" />
                  <EditableText as="span" page="contact" contentKey="contact_phone" defaultText="Mobile / FB: /NanohanaLodge" currentText={getText('contact_phone')} editMode={editMode} />
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock className="w-5 h-5 text-phewa flex-shrink-0 mt-0.5" />
                  <EditableText as="span" page="contact" contentKey="contact_coverage" defaultText="Coverage: 24 hour reception & late checkcheckouts" currentText={getText('contact_coverage')} editMode={editMode} />
                </li>
                <li className="flex items-start gap-2.5">
                  <Globe2 className="w-5 h-5 text-phewa flex-shrink-0 mt-0.5" />
                  <EditableText as="span" page="contact" contentKey="contact_languages" defaultText="Languages: English, Nepali, Hindi, Japanese" currentText={getText('contact_languages')} editMode={editMode} />
                </li>
              </ul>
            </div>

            <div id="map-frame" className="relative h-[250px] w-full rounded-2xl overflow-hidden border border-earth/10">
              <iframe title="Lakeside Pokhara map" className="w-full h-full border-0 grayscale/20 focus:outline-none" src="https://maps.google.com/maps?q=28.20403,83.96605&t=&z=14&ie=UTF8&iwloc=&output=embed" allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </div>
        </div>
      </section>

      <section id="getting-here-directions" className="bg-forest text-cream py-20 border-t border-white/5">
        <div className="max-w-[1240px] mx-auto px-5 md:px-10 lg:px-20">
          <div className="text-center max-w-[600px] mx-auto mb-16 space-y-1">
            <EditableText as="span" page="contact" contentKey="contact_transit_eyebrow" defaultText="Simplified Transit" currentText={getText('contact_transit_eyebrow')} editMode={editMode} className="text-xs font-mono uppercase tracking-[0.15em] text-nanohana font-bold block" />
            <EditableText as="h2" page="contact" contentKey="contact_transit_title" defaultText="Three ways to arrive." currentText={getText('contact_transit_title')} editMode={editMode} className="font-serif text-3xl sm:text-4xl text-cream font-medium" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div className="p-6 bg-white/5 border border-white/10 rounded-xl space-y-3">
              <Plane className="w-8 h-8 text-nanohana" />
              <EditableText as="h3" page="contact" contentKey="transit1_title" defaultText="From Pokhara Airport (PKR)" currentText={getText('transit1_title')} editMode={editMode} className="font-serif text-lg font-bold text-cream" />
              <EditableText as="p" page="contact" contentKey="transit1_desc" defaultText="The terminal sits between 1.4km and 2.8km away. Taxes from terminals take about 10–15 mins. Direct private paid shuttle transfers can be prearranged securely by informing our front desk lead prior to boarding." currentText={getText('transit1_desc')} editMode={editMode} className="text-cream/80 leading-relaxed" />
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-xl space-y-3">
              <Bus className="w-8 h-8 text-nanohana" />
              <EditableText as="h3" page="contact" contentKey="transit2_title" defaultText="Arriving By Bus" currentText={getText('transit2_title')} editMode={editMode} className="font-serif text-lg font-bold text-cream" />
              <EditableText as="p" page="contact" contentKey="transit2_desc" defaultText="The central Sahid Chok bus stop resides directly adjacent next door to our entrance street. Buses operate connecting Lakeside to downtown Pokhara and surrounding Himalayan routes throughout the day." currentText={getText('transit2_desc')} editMode={editMode} className="text-cream/80 leading-relaxed" />
            </div>

            <div className="p-6 bg-white/5 border border-white/10 rounded-xl space-y-3">
              <Footprints className="w-8 h-8 text-nanohana" />
              <EditableText as="h3" page="contact" contentKey="transit3_title" defaultText="On Foot From Lakeside" currentText={getText('transit3_title')} editMode={editMode} className="font-serif text-lg font-bold text-cream" />
              <EditableText as="p" page="contact" contentKey="transit3_desc" defaultText="From main central Lakeside tracks, walk south past Basundhara Park. Ammat is Lakeside Street No. 4. You will physically notice our lovely flower balconies on your left-hand side. Walk in under 10 minutes." currentText={getText('transit3_desc')} editMode={editMode} className="text-cream/80 leading-relaxed" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
