import { useForm } from "react-hook-form";
import { SlLocationPin } from "react-icons/sl";
import { TbMail } from "react-icons/tb";
import { PiPhoneCallFill } from "react-icons/pi";
import emailjs from "@emailjs/browser";
import GlassSwal from "../../utils/glassSwal";

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

const ContactForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

const onSubmit = async (data: FormData) => {
  try {
    const result = await emailjs.send(
      import.meta.env.VITE_EMAIL_JS_SERVICE_ID,
      import.meta.env.VITE_EMAIL_JS_TEMPLATE_ID,
      {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        message: data.message,
        to_name: "Wedding Manager", 
      },
      import.meta.env.VITE_EMAIL_JS_PUBLIC_KEY 
    );

    if (result.status === 200 || result.status === 201) {
      GlassSwal.success(
        "Message Sent Successfully!",
        "Thank you for reaching out. We'll get back to you shortly."
      );
    }
    reset();
  } catch (error) {
    console.error("❌ EmailJS Error:", error);
  }
};

  return (
    <div id="contact" className="">
      <div className=" grid-cols-2 relative h-40 lg:h-[370px] grid my-5">
        <div className="bg-[url('/couple.png')] bg-cover bg-center"></div>
        <div className=""></div>
        <div
          className="absolute w-full h-full text-end  xl:text-[100px] lg:text-7xl md:text-7xl text-3xl font-extrabold font-primary xl:pr-40 flex flex-col justify-around pr-10 z-40"
          style={{
            background:
              "linear-gradient(to left, #D4AF37 50%, rgba(0,0,0,0) 70%)",
          }}
        >
          Contact Us
        </div>
      </div>
      <div className=" flex justify-center pt-10 lg:pt-16 flex-col items-center lg:items-start lg:flex-row lg:gap-16 px-10 gap-10">
        <div className=" max-w-md">
          <h2 className="text-3xl font-primary lg:text-[55px] font-bold">
            Let's talk with us
          </h2>
          <p className="py-5 font-secondary font-normal text-[16px] text-black">
            Questions, comments, or suggestions? Simply fill in the form and
            we'll be in touch shortly.
          </p>
          <div className=" flex flex-col gap-5">
            <div className=" flex gap-3 items-center">
              <SlLocationPin size={24} className=" text-primary" />{" "}
              <p className=" font-secondary font-medium text-lg text-black">
                123 Love Lane, Erie, Pennsylvania 
              </p>
            </div>
            <div className=" flex gap-3 items-center">
              <PiPhoneCallFill size={24} className=" text-primary" />{" "}
              <a href="tel:+18142017107" className=" font-secondary font-medium text-lg text-black">
                +1 (814) 201-7107
              </a>
            </div>
            <div className=" flex gap-3 items-center">
              <TbMail size={24} className=" text-primary" />{" "}
              <a href="mailto:info@erieweddingofficiants.com" className=" font-secondary font-medium text-lg text-black">
                info@erieweddingofficiants.com
              </a>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className=" space-y-4 max-w-lg rounded-xl p-5 lg:p-13 border border-primary"
        >
          <div className="flex gap-4 ">
            <div className="flex-1">
              <input
                {...register("firstName", {
                  required: "First name is required",
                  pattern:{
                    value: /^[A-Za-z]+$/,
                    message: "First name should contain only letters"
                  }
                })}
                placeholder="First Name"
                className="w-full border p-2 rounded-lg outline-none border-gray-400 bg-gray-100 focus:bg-white transition-all duration-300 focus:border-[#D4AF37]"
              />
              {errors.firstName && (
                <span className="text-red-500 text-sm">
                  {errors.firstName.message}
                </span>
              )}
            </div>
            <div className="flex-1">
              <input
                {...register("lastName",
                   {
                  required: "Last name is required",
                  pattern:{
                    value: /^[A-Za-z]+$/,
                    message: "Last name should contain only letters"
                  }
                })}
                placeholder="Last Name"
                className="w-full border p-2 rounded-lg outline-none border-gray-400 bg-gray-100 focus:bg-white transition-all duration-300 focus:border-[#D4AF37]"
              />
              {errors.lastName && (
                <span className="text-red-500 text-sm">
                  {errors.lastName.message}
                </span>
              )}
            </div>
          </div>
          <div>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              })}
              placeholder="Email"
              className="w-full border p-2 rounded-lg outline-none border-gray-400 bg-gray-100 focus:bg-white transition-all duration-300 focus:border-[#D4AF37]"
              type="email"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>
          <div>
            <input
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9+\-()\s]*$/,
                  message: "Invalid phone number",
                },
              })}
              placeholder="Phone Number"
              className="w-full border p-2 rounded-lg outline-none border-gray-400 bg-gray-100 focus:bg-white transition-all duration-300 focus:border-[#D4AF37]"
              type="tel"
            />
            {errors.phone && (
              <span className="text-red-500 text-sm">
                {errors.phone.message}
              </span>
            )}
          </div>
          <div>
            <textarea
              {...register("message", { required: "Message is required" })}
              placeholder="Your Message"
              className="w-full border p-2 rounded-lg outline-none border-gray-400 bg-gray-100 focus:bg-white transition-all duration-300 min-h-28 focus:border-[#D4AF37]"
            />
            {errors.message && (
              <span className="text-red-500 text-sm">
                {errors.message.message}
              </span>
            )}
          </div>
          <button
            type="submit"
            className="bg-gradient-to-b from-[#D4AF37] to-[#B19331] text-white rounded-r-full rounded-l-full w-full px-6 py-2.5 text-lg font-semibold"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
