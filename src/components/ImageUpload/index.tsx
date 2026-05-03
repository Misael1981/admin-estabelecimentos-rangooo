"use client"

import { ImageUp, X } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { UseFormReturn, FieldValues, Path, PathValue } from "react-hook-form"

interface ImageUploadProps<TFormValues extends FieldValues> {
  form: UseFormReturn<TFormValues>
  name: Path<TFormValues>
  initialUrl?: string | null
}

const ImageUpload = <TFormValues extends FieldValues>({
  form,
  name,
  initialUrl = null,
}: ImageUploadProps<TFormValues>) => {
  const [preview, setPreview] = useState<string | null>(initialUrl)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (file) {
      const previewURL = URL.createObjectURL(file)
      setPreview(previewURL)
      form.setValue(
        name,
        file as unknown as PathValue<TFormValues, Path<TFormValues>>,
        { shouldDirty: true },
      )
    }
  }

  const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    setPreview(null)
    form.setValue(
      name,
      null as unknown as PathValue<TFormValues, Path<TFormValues>>,
      { shouldDirty: true },
    )
  }

  const inputId = `file-upload-${name}`

  return (
    <div>
      <div className="w-full bg-slate-200">
        <input
          type="file"
          accept="image/*"
          id={inputId}
          className="hidden"
          onChange={handleLogoChange}
        />

        <label
          htmlFor={inputId}
          className="hover:bg-accent flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-6 transition"
        >
          {preview ? (
            <div className="relative flex min-h-40 items-center justify-center">
              <Image
                src={preview}
                alt="Preview"
                width={128}
                height={128}
                className="object-contain"
              />

              <button
                type="button"
                onClick={handleRemoveImage}
                className="bg-background/80 absolute top-0 right-0 rounded-full p-1 shadow"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <ImageUp className="text-muted-foreground mb-3 h-10 w-10" />
              <span className="text-muted-foreground text-sm">
                Clique para enviar a imagem
              </span>
            </>
          )}
        </label>
      </div>
    </div>
  )
}

export default ImageUpload
