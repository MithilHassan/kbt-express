"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calculator, Package, Plus, Trash2 } from "lucide-react"

export interface PackageData {
  id?: string
  billingWeightKg: string
  billingWeightGm: string
  grossWeight: string
  lengthCm: string
  widthCm: string
  heightCm: string
  pieces: string
  dimensionalWeight: number
  description: string
}

interface MultiplePackagesFormProps {
  packages: PackageData[]
  onPackagesChange: (packages: PackageData[]) => void
}

export default function MultiplePackagesForm({ packages, onPackagesChange }: MultiplePackagesFormProps) {
  const [localPackages, setLocalPackages] = useState<PackageData[]>(packages)

  useEffect(() => {
    setLocalPackages(packages)
  }, [packages])

  useEffect(() => {
    const updatedPackages = localPackages.map((pkg) => {
      const length = Number.parseFloat(pkg.lengthCm) || 0
      const width = Number.parseFloat(pkg.widthCm) || 0
      const height = Number.parseFloat(pkg.heightCm) || 0
      const pieces = Number.parseFloat(pkg.pieces) || 1

      let dimensionalWeight = 0
      if (length > 0 && width > 0 && height > 0) {
        dimensionalWeight = (length * width * height * pieces) / 5000
      }

      const billingKg = Number.parseFloat(pkg.billingWeightKg) || 0
      const billingGm = Number.parseFloat(pkg.billingWeightGm) || 0
      const totalBillingWeight = billingKg + billingGm / 1000

      const calculatedGrossWeight = Math.max(totalBillingWeight, dimensionalWeight)

      return {
        ...pkg,
        dimensionalWeight,
        grossWeight: calculatedGrossWeight > 0 ? calculatedGrossWeight.toFixed(3) : "0",
      }
    })

    if (JSON.stringify(updatedPackages) !== JSON.stringify(localPackages)) {
      setLocalPackages(updatedPackages)
      onPackagesChange(updatedPackages)
    }
  }, [
    localPackages
      .map(
        (pkg) =>
          `${pkg.lengthCm}-${pkg.widthCm}-${pkg.heightCm}-${pkg.pieces}-${pkg.billingWeightKg}-${pkg.billingWeightGm}`,
      )
      .join("|"),
  ])

  const addPackage = () => {
    const newPackage: PackageData = {
      billingWeightKg: "",
      billingWeightGm: "",
      grossWeight: "",
      lengthCm: "",
      widthCm: "",
      heightCm: "",
      pieces: "1",
      dimensionalWeight: 0,
      description: "",
    }
    const updatedPackages = [...localPackages, newPackage]
    setLocalPackages(updatedPackages)
    onPackagesChange(updatedPackages)
  }

  const removePackage = (index: number) => {
    if (localPackages.length > 1) {
      const updatedPackages = localPackages.filter((_, i) => i !== index)
      setLocalPackages(updatedPackages)
      onPackagesChange(updatedPackages)
    }
  }

  const updatePackage = (index: number, field: keyof PackageData, value: string) => {
    const updatedPackages = localPackages.map((pkg, i) => (i === index ? { ...pkg, [field]: value } : pkg))
    setLocalPackages(updatedPackages)
  }

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Package className="h-5 w-5 text-[#0253A3]" />
            Package Information
          </CardTitle>
          <Button
            type="button"
            onClick={addPackage}
            variant="outline"
            size="sm"
            className="border-blue-200 text-[#0253A3] hover:bg-blue-50 bg-transparent"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Package
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {localPackages.map((pkg, index) => (
          <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-900">Package {index + 1}</h4>
              {localPackages.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removePackage(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Weight Information */}
            <div className="space-y-4">
              <h5 className="font-medium text-slate-800">Weight Information</h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`billingWeightKg-${index}`}>Billing Weight (kg)</Label>
                  <Input
                    id={`billingWeightKg-${index}`}
                    type="number"
                    step="0.001"
                    value={pkg.billingWeightKg}
                    onChange={(e) => updatePackage(index, "billingWeightKg", e.target.value)}
                    className="border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`billingWeightGm-${index}`}>Billing Weight (gm)</Label>
                  <Input
                    id={`billingWeightGm-${index}`}
                    type="number"
                    step="0.001"
                    value={pkg.billingWeightGm}
                    onChange={(e) => updatePackage(index, "billingWeightGm", e.target.value)}
                    className="border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`grossWeight-${index}`}>Gross Weight (kg)</Label>
                  <Input
                    id={`grossWeight-${index}`}
                    type="number"
                    step="0.001"
                    value={pkg.grossWeight}
                    className="border-slate-300 bg-slate-50"
                    readOnly
                    title="Auto-calculated as the higher of billing weight or dimensional weight"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Dimensional Weight Calculator */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-blue-600" />
                <h5 className="font-medium text-slate-800">Dimensions</h5>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`lengthCm-${index}`}>Length (cm)</Label>
                  <Input
                    id={`lengthCm-${index}`}
                    type="number"
                    step="0.01"
                    value={pkg.lengthCm}
                    onChange={(e) => updatePackage(index, "lengthCm", e.target.value)}
                    className="border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`widthCm-${index}`}>Width (cm)</Label>
                  <Input
                    id={`widthCm-${index}`}
                    type="number"
                    step="0.01"
                    value={pkg.widthCm}
                    onChange={(e) => updatePackage(index, "widthCm", e.target.value)}
                    className="border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`heightCm-${index}`}>Height (cm)</Label>
                  <Input
                    id={`heightCm-${index}`}
                    type="number"
                    step="0.01"
                    value={pkg.heightCm}
                    onChange={(e) => updatePackage(index, "heightCm", e.target.value)}
                    className="border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`pieces-${index}`}>Pieces</Label>
                  <Input
                    id={`pieces-${index}`}
                    type="number"
                    min="1"
                    value={pkg.pieces}
                    onChange={(e) => updatePackage(index, "pieces", e.target.value)}
                    className="border-slate-300"
                  />
                </div>
              </div>
              {pkg.dimensionalWeight > 0 && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      Dimensional Weight: {pkg.dimensionalWeight.toFixed(3)} kg
                    </Badge>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">Formula: (L × W × H × Pcs) ÷ 5000</p>
                </div>
              )}
            </div>

            <Separator />

            {/* Package Description */}
            <div className="space-y-2">
              <Label htmlFor={`description-${index}`}>Package Description</Label>
              <Textarea
                id={`description-${index}`}
                value={pkg.description}
                onChange={(e) => updatePackage(index, "description", e.target.value)}
                className="border-slate-300"
                rows={2}
                placeholder="Describe the contents of this package..."
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
