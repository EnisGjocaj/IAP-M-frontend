import React from "react";
import { cn } from "../../lib/utils";
import { Marquee } from "../magicui/marquee";
import { testimonialData } from "../data";
import { FaQuoteLeft } from "react-icons/fa";

const firstRow = testimonialData.slice(0, testimonialData.length / 2);
const secondRow = testimonialData.slice(testimonialData.length / 2);

const TestimonialCard = ({ img, name, profession, description, rating }) => {
  return (
    <figure
      className={cn(
        "relative h-full w-80 mx-1 cursor-pointer overflow-hidden rounded-xl border p-6",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex items-center mb-4 gap-1">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>

      <blockquote className="mt-4 text-sm text-gray-600 dark:text-gray-300 line-clamp-4">
        {description}
      </blockquote>

      <div className="flex flex-row items-center gap-3 mt-6 pt-4 border-t border-gray-950/[.1] dark:border-gray-50/[.1]">
        <img 
          className="rounded-full" 
          width="40" 
          height="40" 
          alt={name} 
          src={img}
        />
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium text-gray-500 dark:text-white/40">
            {profession}
          </p>
        </div>
      </div>
    </figure>
  );
};

const Testimonial = () => {
  return (
    <section className="py-24 relative">
    
      <div className="text-center mb-16">
        <span className="text-sm font-medium inline-block px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full mb-4 dark:bg-indigo-900/30 dark:text-indigo-300">
          TESTIMONIALS
        </span>
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          Studentet Tone!
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Degjojeni nga studentet tane se si eksperienca e tyre me IAP-M ka ndryshuar karrieren e tyre.
        </p>
      </div>

      <div className="relative flex w-full flex-col items-center justify-center overflow-hidden gap-8">
        <Marquee 
          pauseOnHover 
          className="w-full"
          duration={40}
        >
          {firstRow.map((testimonial) => (
            <TestimonialCard key={testimonial.id} {...testimonial} />
          ))}
        </Marquee>

        <Marquee 
          reverse 
          pauseOnHover 
          className="w-full"
          duration={40}
        >
          {secondRow.map((testimonial) => (
            <TestimonialCard key={testimonial.id} {...testimonial} />
          ))}
        </Marquee>

        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-white dark:from-gray-950"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-white dark:from-gray-950"></div>
      </div>
    </section>
  );
};

export default Testimonial;
