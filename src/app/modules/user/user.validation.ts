import z from "zod";
const registerUser = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required!",
    }),
    email: z
      .string({
        required_error: "Email is required!",
      })
      .email({
        message: "Invalid email format!",
      }),
    password: z.string({
      required_error: "Password is required!",
    }),
    // bloodType: z.string({
    //   required_error: "Blood type is required!",
    // }),
    // location: z.string({
    //   required_error: "Location is required!",
    // }),
    age: z.number().int({
      message: "Age must be an integer!",
    }),
    bio: z.string({
      required_error: "Bio is required!",
    }),
    // lastDonationDate: z.string({
    //   required_error: "Last donation date is required!",
    // }),
  }),
});

const updateProfileSchema = z.object({
  body: z.object({
    age: z
      .number()
      .int({
        message: "Age must be an integer!",
      })
      .optional(),
    bio: z
      .string({
        required_error: "Bio is required!",
      })
      .optional(),
    lastDonationDate: z
      .string({
        required_error: "Last donation date is required!",
      })
      .optional(),
  }),
});

export const userValidation = { registerUser, updateProfileSchema };
