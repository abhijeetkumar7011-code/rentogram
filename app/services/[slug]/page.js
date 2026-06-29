import { notFound } from "next/navigation";
import ServicePage from "../../../components/ServicePage";
import { servicesData } from "../../../lib/servicesData";

export function generateStaticParams() {
  return Object.keys(servicesData).map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const service = servicesData[params.slug];
  return { title: service ? `${service.badge} - Rentogram` : "Rentogram" };
}

export default function ServiceDetailPage({ params }) {
  const service = servicesData[params.slug];

  if (!service) return notFound();

  const { Icon, ...rest } = service;

  return <ServicePage {...rest} icon={<Icon className="text-white" size={24} />} />;
}
