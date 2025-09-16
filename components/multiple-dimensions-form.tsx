"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Minus, Package } from "lucide-react"

export interface DimensionData {
  lengthCm: string
  widthCm: string
  heightCm: string
  pieces: string
  description: string
  dimensionalWeight: number
}

interface MultipleDimensionsFormProps {
  dimensions: DimensionData[]
  onDimensionsChange: (dimensions: DimensionData[]) => void
}

function MultipleDimensionsForm({ dimensions, onDimensionsChange }: MultipleDimensionsFormProps) {
  const calculateDimensionalWeight = (length: string, width: string, height: string): number => {
    const l = Number.parseFloat(length) || 0
    const w = Number.parseFloat(width) || 0
    const h = Number.parseFloat(height) || 0
    return l && w && h ? (l * w * h) / 5000 : 0
  }

  const updateDimension = (index: number, field: keyof DimensionData, value: string) => {
    const newDimensions = [...dimensions]
    newDimensions[index] = { ...newDimensions[index], [field]: value }

    // Recalculate dimensional weight if dimensions changed
    if (field === "lengthCm" || field === "widthCm" || field === "heightCm") {
      newDimensions[index].dimensionalWeight = calculateDimensionalWeight(
        field === "lengthCm" ? value : newDimensions[index].lengthCm,
        field === "widthCm" ? value : newDimensions[index].widthCm,
        field === "heightCm" ? value : newDimensions[index].heightCm,
      )
    }

    onDimensionsChange(newDimensions)
  }

  const addDimension = () => {
    onDimensionsChange([
      ...dimensions,
      {
        lengthCm: "",
        widthCm: "",
        heightCm: "",
        pieces: "1",
        description: "",
        dimensionalWeight: 0,
      },
    ])
  }

  const removeDimension = (index: number) => {
    if (dimensions.length > 1) {
      onDimensionsChange(dimensions.filter((_, i) => i !== index))
    }
  }

  const totalDimensionalWeight = dimensions.reduce((sum, dim) => sum + dim.dimensionalWeight, 0)
  const totalPieces = dimensions.reduce((sum, dim) => sum + (Number.parseInt(dim.pieces) || 0), 0)

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50 border-b border-slate-200">
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <Package className="h-5 w-5 text-[#0253A3]" />
          Package Dimensions
        </CardTitle>
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">Add multiple dimension entries for your shipment</p>
          <Button
            type="button"
            onClick={addDimension}
            variant="outline"
            size="sm"
            className="border-blue-200 text-[#0253A3] hover:bg-blue-50 bg-transparent"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Dimension
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          {dimensions.map((dimension, index) => (
            <div key={index} className="border border-slate-200 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-slate-900">Dimension Set {index + 1}</h4>
                {dimensions.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeDimension(index)}
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-700 hover:bg-red-50"
                  >
                    <Minus className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`length-${index}`}>Length (cm) *</Label>
                  <Input
                    id={`length-${index}`}
                    type="number"
                    step="0.1"
                    value={dimension.lengthCm}
                    onChange={(e) => updateDimension(index, "lengthCm", e.target.value)}
                    required
                    className="border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`width-${index}`}>Width (cm) *</Label>
                  <Input
                    id={`width-${index}`}
                    type="number"
                    step="0.1"
                    value={dimension.widthCm}
                    onChange={(e) => updateDimension(index, "widthCm", e.target.value)}
                    required
                    className="border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`height-${index}`}>Height (cm) *</Label>
                  <Input
                    id={`height-${index}`}
                    type="number"
                    step="0.1"
                    value={dimension.heightCm}
                    onChange={(e) => updateDimension(index, "heightCm", e.target.value)}
                    required
                    className="border-slate-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`pieces-${index}`}>Pieces *</Label>
                  <Input
                    id={`pieces-${index}`}
                    type="number"
                    min="1"
                    value={dimension.pieces}
                    onChange={(e) => updateDimension(index, "pieces", e.target.value)}
                    required
                    className="border-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`description-${index}`}>Description</Label>
                <Textarea
                  id={`description-${index}`}
                  value={dimension.description}
                  onChange={(e) => updateDimension(index, "description", e.target.value)}
                  className="border-slate-300"
                  rows={2}
                  placeholder="Optional description for this dimension set"
                />
              </div>

              {dimension.dimensionalWeight > 0 && (
                <div className="text-sm text-slate-600 bg-slate-50 p-2 rounded">
                  Dimensional Weight: {dimension.dimensionalWeight.toFixed(2)} kg
                </div>
              )}
            </div>
          ))}

          {/* Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-[#0253A3] mb-2">Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span>Total Pieces:</span>
                <span className="font-medium ml-2">{totalPieces}</span>
              </div>
              <div>
                <span>Total Dimensional Weight:</span>
                <span className="font-medium ml-2">{totalDimensionalWeight.toFixed(2)} kg</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export { MultipleDimensionsForm }
export default MultipleDimensionsForm
