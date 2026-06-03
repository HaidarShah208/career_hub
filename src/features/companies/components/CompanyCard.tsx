import { Link } from 'react-router-dom'
import { BadgeCheck, Briefcase, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'

import { Badge } from '@/shared/components/ui/badge'
import { Card } from '@/shared/components/ui/card'
import { StarRating } from '@/shared/components/common/StarRating'
import { ROUTES } from '@/shared/constants'
import type { Company } from '../types'

export function CompanyCard({ company }: { company: Company }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.3 }}
    >
      <Link to={ROUTES.companyDetails(company.id)}>
        <Card className="group h-full p-5 text-center hover:border-primary/40 hover:shadow-md">
          <div className="flex flex-col items-center">
            <img
              src={company.logoUrl}
              alt={company.name}
              loading="lazy"
              className="h-16 w-16 rounded-xl border border-border object-cover"
            />
            <h3 className="mt-3 flex items-center gap-1 text-sm font-semibold transition-colors group-hover:text-primary">
              {company.name}
              {company.isVerified && <BadgeCheck className="h-4 w-4 text-info" />}
            </h3>
            <p className="text-xs text-muted-foreground">{company.industry}</p>
            <StarRating rating={company.rating} showValue className="mt-2" />
            <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {company.city}
              </span>
              <Badge variant="soft" className="gap-1">
                <Briefcase className="h-3 w-3" /> {company.openJobs} jobs
              </Badge>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}
