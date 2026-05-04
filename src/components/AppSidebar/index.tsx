"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import LogoutButton from "../LogoutButton"
import {
  ClipboardList,
  Clock3,
  LayoutDashboard,
  Motorbike,
  ShoppingBasket,
  SlidersHorizontal,
  Store,
  Users,
} from "lucide-react"

const AppSidebar = () => {
  const params = useParams()
  const slug = params.slug as string

  const pages = [
    {
      name: "Visão Geral",
      url: `/${slug}/dashboard`,
      icon: LayoutDashboard,
    },
    {
      name: "Gerenciar Pedidos",
      url: `/${slug}/dashboard/pedidos`,
      icon: ClipboardList,
    },
    {
      name: "Perfil do Estabelecimento",
      url: `/${slug}/dashboard/perfil`,
      icon: Store,
    },
    {
      name: "Plano e Métodos",
      url: `/${slug}/dashboard/plano-metodos`,
      icon: SlidersHorizontal,
    },
    {
      name: "Horários de Funcionamento",
      url: `/${slug}/dashboard/horarios-funcionamento`,
      icon: Clock3,
    },
    {
      name: "Gerenciar Cardápio",
      url: `/${slug}/dashboard/cardapio`,
      icon: ShoppingBasket,
    },
    {
      name: "Gerenciar Usuários",
      url: `/${slug}/dashboard/usuarios`,
      icon: Users,
    },
    {
      name: "Entregadores Rangooo Disponíveis",
      url: `/${slug}/dashboard/entregadores`,
      icon: Motorbike,
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="bg-blue flex h-40 w-full items-center justify-center rounded-md border-2 border-red-400 bg-amber-50">
          <Image src="/logo-rangooo.png" alt="Logo" width={160} height={160} />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Aplicações</SidebarGroupLabel>
          <SidebarMenu>
            {pages.map((page) => (
              <SidebarMenuItem key={page.url}>
                <SidebarMenuButton asChild>
                  <Link href={page.url}>
                    <page.icon />
                    <span>{page.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <LogoutButton />
      </SidebarFooter>
    </Sidebar>
  )
}

export default AppSidebar
