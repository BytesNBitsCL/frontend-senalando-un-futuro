'use client'

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import styles from "@/app/styles/auth.module.scss"
import Image from "next/image";
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  correoUsuario: z.string().email({
    message: "Debe ser un correo electrónico válido.",
  }),
  contrasenaUsuario: z.string().min(8, {
    message: "La contraseña debe tener al menos 8 caracteres.",
  }),
})
const sections = [
  {
    image: "/svg/videollamada.svg"
  }]


export default function LoginPage() {
  const router = useRouter()
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      correoUsuario: "",
      contrasenaUsuario: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setLoginError(null)

    try {
      const res = await signIn('credentials', {
        email: values.correoUsuario,
        password: values.contrasenaUsuario,
        redirect: false,
      })

      if (res?.error) {
        setLoginError('Error en las credenciales.')
      } else {
        router.push('/niveles')
      }
    } catch (error) {
      setLoginError("Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/niveles" })
  }

  return (
    <div className={styles.backgroundImageLogin}>
      <div className="flex flex-col lg:flex-row-reverse items-center justify-center gap-1 sm:gap-6 md:justify-evenly lg:flex-wrap min-h-screen mt-16 lg:mt-0">
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="text-center">Iniciar sesión</CardTitle>
            <CardDescription className="text-center">
              Ingresa tus credenciales para acceder
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="correoUsuario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo electrónico</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contrasenaUsuario"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {loginError && (
                  <div className="text-red-500 text-sm">{loginError}</div>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Iniciando sesión...
                    </>
                  ) : (
                    "Iniciar sesión"
                  )}
                </Button>
              </form>
            </Form>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  O continúa con
                </span>
              </div>
            </div>
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn}>
              <svg
                className="mr-2 h-4 w-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              Iniciar sesión con Google
            </Button>
          </CardContent>
          <CardFooter className="flex flex-col justify-center gap-2">
            <p>
              <Link href="/resetPassword" className="text-primary hover:underline">
                Recuperar contraseña
              </Link>
            </p>
            <p className="text-sm text-muted-foreground">
              ¿No tienes una cuenta?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Regístrate
              </Link>
            </p>
          </CardFooter>
        </Card>
        <div className="flex items-center justify-center bg-white outline outline-primary-300 shadow-xl shadow-primary-500 lg:w-[500px] lg:h-[500px] rounded-full p-7 md:p-0 overflow-hidden">
          <Image
            src={sections[0].image}
            alt="Sticker video llamada"
            width={360}
            height={360}
            className="object-contain rounded-bl-[20%] rounded-br-[20%] "
          />
        </div>
      </div>
    </div>
  )
}