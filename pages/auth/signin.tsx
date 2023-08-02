import React, { useState } from "react";
import Image from "next/image";

import Logo from "../../utils/horizontalLogo.png";
import { IMessage } from "@/utils/models";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

type LoginTypes = {
  email: string;
  password: string;
};

function SignIn() {
  const { push } = useRouter();

  const [user, setUser] = useState<LoginTypes>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  function handleChange(e: any) {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  }
  async function handleLogin() {
    setLoading(true);
    let signInResponse = await signIn("credentials", {
      email: user.email,
      password: user.password,
      redirect: false,
    });
    if (!signInResponse?.ok) {
      toast.error(
        signInResponse?.error ? signInResponse?.error : "Erro ao fazer login."
      );
      setLoading(false);
    }

    if (signInResponse?.ok) {
      push("/");
      setLoading(false);
    }
  }

  return (
    <section className="h-screen grow">
      <div className="grid h-full grid-cols-1 grid-rows-2 items-center gap-2 lg:grid-cols-2 lg:grid-rows-1">
        <div className="flex items-center justify-center">
          <Image alt="Logo" src={Logo}></Image>
        </div>
        <form className="flex h-full w-full flex-col items-center justify-start px-6 lg:items-start lg:justify-center lg:px-0">
          <input
            type="text"
            name="email"
            className="form-control m-0 mb-6 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-4 py-2 text-xl font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none md:w-[400px] lg:w-[400px] xl:w-[500px]"
            placeholder="Email"
            value={user.email}
            onChange={(e) => handleChange(e)}
          />

          <input
            type="password"
            name="password"
            className="form-control m-0 mb-6 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-4 py-2 text-xl font-normal text-gray-700 transition ease-in-out focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none md:w-[400px] lg:w-[400px] xl:w-[500px]"
            placeholder="Senha"
            value={user.password}
            onChange={(e) => handleChange(e)}
          />
          <div className="flex flex-col items-center justify-center gap-2 lg:flex-row lg:justify-start">
            <button
              disabled={!!loading}
              type="button"
              className="inline-block rounded bg-blue-600 px-7 py-3 text-sm font-medium uppercase leading-snug text-white shadow-md transition duration-150 ease-in-out focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 disabled:bg-gray-500 disabled:text-white hover:bg-blue-700 hover:shadow-lg active:bg-blue-800 active:shadow-lg"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default SignIn;
