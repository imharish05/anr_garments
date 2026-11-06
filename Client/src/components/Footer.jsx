import React from 'react';
import { COMPANY_INFO } from '../data/mockData';
import {
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Send,
  Navigation,
  Heart
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#1A175A] text-white pt-16 pb-10 border-t border-white/10 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter & Subscription Banner */}
        <div className="bg-[#141247] p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl mb-16 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center lg:text-left">
            <span className="text-xs uppercase font-bold text-amber-300 tracking-wider">
              Hospital Procurement & Direct Supply
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Connect With ANR Hospital Garments
            </h3>
            <p className="text-sm text-blue-200 max-w-xl">
              Partner directly with our Bangalore manufacturing facility for super-specialty hospital scrubs, doctor aprons, and patient wear.
            </p>
          </div>

          <div className="w-full lg:w-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="tel:9986044574"
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-[#1A175A] font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <Phone className="w-4 h-4" />
                <span>Call: 9986044574</span>
              </a>
              <a
                href={COMPANY_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4 text-amber-300" />
                <span>Google Map</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4 Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand & Key Persons */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="py-1 px-3 rounded-lg bg-white/5 border border-white/10">
                <span className="font-sans text-2xl font-black tracking-widest text-white">ΛNR</span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-blue-200 font-bold block">Hospital Garments</span>
              </div>
            </div>

            <p className="text-blue-100 text-xs sm:text-sm leading-relaxed max-w-sm pt-2">
              Manufacturers of premium clinical scrub suits, physician consultation aprons, underscrubs, and patient wear. Serving premier healthcare institutions with distinction.
            </p>

            <div className="pt-2 text-xs text-blue-200 space-y-1">
              <p className="font-semibold text-white">Key Executive Partners:</p>
              <p>• <strong>Mr. Manjunath Rao G</strong> (Mobile: 9986044574)</p>
              <p>• <strong>Mr. Balraj. V</strong> (Mobile: 6363429113)</p>
            </div>
          </div>

          {/* Col 2: The 5 Products */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-amber-300 mb-4">
              5 Core Products
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-blue-100">
              <li><a href="#scrubs-collection" className="hover:text-white transition-colors">1. Scrub Suits (Men & Women)</a></li>
              <li><a href="#aprons-collection" className="hover:text-white transition-colors">2. Aprons for Men & Women</a></li>
              <li><a href="#underscrubs-collection" className="hover:text-white transition-colors">3. Underscrubs (Men & Women)</a></li>
              <li><a href="#patient-wear-collection" className="hover:text-white transition-colors">4. Patient Gowns</a></li>
              <li><a href="#patient-wear-collection" className="hover:text-white transition-colors">5. Patient Pant & Shirt Sets</a></li>
              <li><a href="#shop-colors" className="hover:text-white transition-colors">All Hospital Colours</a></li>
            </ul>
          </div>

          {/* Col 3: Services & Solutions */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-amber-300 mb-4">
              Institutional Services
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-blue-100">
              <li><a href="#custom-embroidery" className="hover:text-white transition-colors">Hospital Crest Embroidery</a></li>
              <li><a href="#custom-embroidery" className="hover:text-white transition-colors">Doctor Name Digitizing</a></li>
              <li><a href="#bulk-inquiry" className="hover:text-white transition-colors">Bulk Institutional Quotes</a></li>
              <li><a href="#fabric-tech" className="hover:text-white transition-colors">Fabric Durability Testing</a></li>
              <li><a href="#factory-location" className="hover:text-white transition-colors">Bangalore Factory Visit</a></li>
              <li><a href="#faq" className="hover:text-white transition-colors">Care & Autoclave Guide</a></li>
            </ul>
          </div>

          {/* Col 4: Factory & Contact Details */}
          <div>
            <h4 className="text-xs uppercase font-bold tracking-widest text-amber-300 mb-4">
              Bangalore Facility
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-blue-100">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-300 flex-shrink-0" />
                <span>9986044574 / 6363429113</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-300 flex-shrink-0" />
                <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-white">
                  {COMPANY_INFO.email}
                </a>
              </li>
              <li className="pt-2">
                <a
                  href={COMPANY_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-white transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Google Maps Location Link →</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-blue-200 gap-4">
          <div>
            © {new Date().getFullYear()} ANR Hospital Garments. Bangalore, Karnataka. All Rights Reserved.
          </div>
          <div className="text-[11px] text-amber-300 font-semibold">
            {COMPANY_INFO.slogan}
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
