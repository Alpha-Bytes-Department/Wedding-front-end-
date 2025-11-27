import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAxios } from "../Providers/useAxios";
import { GlassSwal } from "../../utils/glassSwal";
import { useEffect, useState } from "react";
import FooterLogo from "./FooterLogo";

const Footer = () => {
  const axios = useAxios();
  const navigate = useNavigate();
  const location = useLocation();
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email");
    console.log(email);
    const res = await axios.post("/marketing/subscribe", { email });
    if (res.status === 200 || res.status === 201) {
      console.log("Subscription successful:", res.data);
      GlassSwal.success(
        "Successfully subscribed! Thank you for joining us.",
        "You'll receive updates about our latest features and offers."
      );
      form.reset();
    }
  };
   const scrollToReview = (section:string) => {
      // Check if we're already on the home page
      if (location.pathname === "/") {
        // If on home page, just scroll to the element
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      } else {
        // If on a different page, navigate to home with hash
        navigate("/#" + section);
      }
    };
  
    // Handle scrolling when navigating to home with hash
    useEffect(() => {
      if (location.hash === "#client-review") {
        // Small delay to ensure the component is rendered
        setTimeout(() => {
          const element = document.getElementById("client-review");
          if (element) {
            element.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 100);
      }
    }, [location]);

    const [glow,setGlow]=useState<boolean>(false);
    const [glowSubscribe,setGlowSubscribe]=useState<boolean>(false);

  return (
    <div className="text-black bg-gradient-to-t from-[#d4af3763] to-[#fffffe] py-5 lg:px-30 px-5 md:px-10">
      <div className="pb-20  pt-5 xl:px-14 flex flex-col md:flex-row gap-5 md:justify-between">
        <div>
          <h1 className=" text-text font-primary font-semibold text-start text-xl">
            Subscribe to Updates
          </h1>
          <p className=" text-lg text-black-web text-start font-secondary">
            Stay informed about our latest features and offers.
          </p>
        </div>
        <div
          className={` border rounded-2xl  text-center border-transparent transition-all duration-300 ${
            glowSubscribe
              ? "border-orange-800 shadow-[0_0_20px_rgba(255,140,0,0.6)] p-2 animate-pulse"
              : ""
          }`}
        >
          <form action="" onSubmit={onSubmit} className="flex gap-2 lg:gap-4 pb-3">
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Your Email Here"
              className="border border-primary lg:w-full w-3/4 rounded-2xl text-xl font-secondary px-2 lg:px-5 py-2 bg-[#D4AF3733]"
            />
            <button
              className=" cursor-pointer border border-primary rounded-2xl text-xl font-secondary px-5 py-2 bg-transparent"
              type="submit"
            >
              Join
            </button>
          </form>
          <p className=" text-xs text-primary">
            By subscribing, you agree to our{" "}
            <span
              onClick={() =>
                (
                  document.getElementById("privacy-modal") as HTMLDialogElement
                )?.showModal()
              }
              className="underline cursor-pointer"
            >
              Privacy Policy.
            </span>
          </p>
        </div>
      </div>

      <div className=" grid grid-cols-2 gap-10 md:grid-cols-3 xl:gap-32 lg:grid-cols-5">
        <div className=" flex justify-start md:justify-center">
          <FooterLogo />
        </div>
        <div>
          <h1 className=" text-start font-secondary font-semibold text-lg pb-3">
            Helpful Links
          </h1>
          <ul>
            <li
              onClick={() => scrollToReview("client-review")}
              className=" text-[16px] text-text cursor-pointer font-secondary py-3"
            >
              Testimonial
            </li>
            <li
              onClick={() => scrollToReview("contact")}
              className=" text-[16px] cursor-pointer text-text font-secondary py-3"
            >
              Contact Support
            </li>
            <li className=" text-[16px] text-text font-secondary py-3">
              <Link to="dashboard/ceremony">Ceremony</Link>
            </li>
          </ul>
        </div>
        <div className="">
          <h1 className=" text-start font-secondary font-semibold text-lg pb-3">
            Legal Info
          </h1>
          <ul>
            <li
              onClick={() =>
                (
                  document.getElementById("privacy-modal") as HTMLDialogElement
                )?.showModal()
              }
              className=" cursor-pointer text-[16px] text-text font-secondary py-3"
            >
              Privacy Policy
            </li>
            <li
              onClick={() =>
                (
                  document.getElementById("privacy-modal") as HTMLDialogElement
                )?.showModal()
              }
              className="cursor-pointer text-[16px] text-text font-secondary py-3"
            >
              Terms of Use
            </li>
          </ul>
        </div>
        <div>
          <h1 className=" text-start font-secondary font-semibold text-lg pb-3">
            Stay Connected
          </h1>
          <ul>
            <li
              onClick={() => setGlow(true)}
              className=" text-[16px] text-text font-secondary cursor-pointer py-3"
            >
              Social Media
            </li>
            <li
              onClick={() => setGlowSubscribe(true)}
              className=" text-[16px] text-text cursor-pointer font-secondary py-3"
            >
              Newsletter
            </li>

            <li className=" text-[16px] text-text font-secondary py-3">
              <Link to="/officiant">Officiant</Link>
            </li>
          </ul>
        </div>
        <div>
          <h1 className=" text-start font-secondary font-semibold text-lg pb-3">
            Get In Touch
          </h1>
          <ul>
            <li className=" text-[16px] text-text font-secondary py-3">
              <a href="mailto:info@erieweddingofficiants.com">Email Us</a>
            </li>
            <li className=" text-[16px] text-text font-secondary py-3">
              <a href="tel:+18142017107">Call Us</a>
            </li>
          </ul>
        </div>
      </div>
      <hr className="opacity-10 " />
      <div className=" flex justify-between md:flex-row flex-col items-center  ">
        <h1 className="text-center md:text-start py-8 text-[16px] font-secondary">
          © 2025 ERIE WEDDING OFFICIANTS. All rights reserved.
        </h1>
        <div
          className={`flex gap-4 p-3 rounded-xl hover:border-yellow-300 border border-transparent transition-all duration-300 ${
            glow
              ? "border-orange-800 shadow-[0_0_20px_rgba(255,140,0,0.6)] animate-pulse"
              : ""
          }`}
        >
          <a
            href="https://www.facebook.com/profile.php?id=61583542410456"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebook size={24} />
          </a>
          <a
            href="https://www.instagram.com/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram size={24} />
          </a>
          <a
            href="https://x.com/erieofficiants"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaXTwitter size={24} />
          </a>
          <a
            href="https://www.linkedin.com/in/steven-ferringer-1b0169396/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedinIn size={24} />
          </a>
          <a
            href=" https://www.youtube.com/channel/UCzFGEXO2FS1Ts-W-5ZBU67w"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube size={24} />
          </a>
        </div>
      </div>
      {/*=================== Privacy policy modal ===========================  */}
      <dialog id="privacy-modal" className="modal ">
        <div className="modal-box max-w-4xl">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-thin text-lg italic text-center mb-4">
            Privacy Policy and terms and condition for <br />
            <span className="font-bold text-primary not-italic">
              ERIE WEDDING OFFICIANTS
            </span>
          </h3>
          <hr className="opacity-10 my-5" />
          <div className="text-gray-700 max-h-[60vh] overflow-y-auto pr-2 space-y-4 text-sm leading-relaxed">
            <p>
              <strong>Last Updated:</strong> September 12, 2025
            </p>

            <p>
              At <strong>Erie Wedding Officiants</strong>, we value your trust
              and are committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, and safeguard your information when
              you interact with our wedding event management services, website,
              and communications.
            </p>

            <h3 className="font-semibold text-lg text-primary">
              1. Information We Collect
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Personal Information:</strong> such as your name, email
                address, phone number, and contact details when you inquire
                about our wedding services or subscribe to our updates.
              </li>
              <li>
                <strong>Wedding Details:</strong> event dates, venues, guest
                count, and specific ceremony requirements.
              </li>
              <li>
                <strong>Usage Data:</strong> information on how you use our
                site, including pages visited, time spent, and browser/device
                information.
              </li>
              <li>
                <strong>Cookies & Tracking:</strong> small files stored on your
                device to improve your browsing experience.
              </li>
            </ul>

            <h3 className="font-semibold text-lg text-primary">
              2. How We Use Your Information
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li>
                To provide wedding officiant and event management services.
              </li>
              <li>
                To send you updates, newsletters, and promotional offers related
                to wedding services.
              </li>
              <li>
                To personalize your wedding experience and improve our services.
              </li>
              <li>
                To respond to your inquiries and provide customer support for
                your special day.
              </li>
              <li>To comply with legal and regulatory requirements.</li>
            </ul>

            <h3 className="font-semibold text-lg text-primary">
              3. Data Sharing & Disclosure
            </h3>
            <p>
              We do <strong>not</strong> sell or rent your personal information.
              We may share your data only with:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Service Providers:</strong> trusted third parties who
                assist in operating our website, processing payments, or
                providing wedding-related services.
              </li>
              <li>
                <strong>Wedding Vendors:</strong> only with your explicit
                consent to coordinate your event.
              </li>
              <li>
                <strong>Legal Obligations:</strong> when required by law or to
                protect our legal rights.
              </li>
            </ul>

            <h3 className="font-semibold text-lg text-primary">
              4. Data Security
            </h3>
            <p>
              We implement industry-standard measures to protect your personal
              information and wedding details. However, no online system can
              guarantee 100% security.
            </p>

            <h3 className="font-semibold text-lg text-primary">
              5. Your Rights
            </h3>
            <ul className="list-disc list-inside space-y-2">
              <li>Access and request a copy of your data.</li>
              <li>
                Request corrections to inaccurate or incomplete information.
              </li>
              <li>Opt out of promotional emails at any time.</li>
              <li>
                Request deletion of your data, subject to legal obligations.
              </li>
            </ul>

            <h3 className="font-semibold text-lg text-primary">6. Cookies</h3>
            <p>
              We use cookies to analyze traffic, personalize content, and
              improve user experience. You can manage cookies through your
              browser settings.
            </p>

            <h3 className="font-semibold text-lg text-primary">
              7. Third-Party Links
            </h3>
            <p>
              Our website may contain links to third-party wedding vendor sites.
              We are not responsible for the privacy practices of external
              websites.
            </p>

            <h3 className="font-semibold text-lg text-primary">
              8. Updates to This Policy
            </h3>
            <p>
              We may update this Privacy Policy from time to time. Changes will
              be posted on this page with an updated date.
            </p>

            <h3 className="font-semibold text-lg text-primary">
              9. Contact Us
            </h3>
            <p>
              If you have any questions about this Privacy Policy, you can
              contact us at:
              <br />
              📧 info@erieweddingofficiants.com
              <br />
              📍 123 Love Lane, Erie, Pennsylvania
            </p>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Footer;
