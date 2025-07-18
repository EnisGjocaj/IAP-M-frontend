"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, Upload } from "lucide-react"
import { createNews, getNewsById, updateNews } from "../../../api/news"
import { toast } from "react-toastify"
import { useState, useEffect } from "react"

import { Button } from "../../../components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form"
import { Input } from "../../../components/ui/input"
import { Textarea } from "../../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../../components/ui/breadcrumb"
import { Separator } from "../../../components/ui/separator"
import { SidebarTrigger } from "../../../components/ui/sidebar"
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Image, X, GripVertical, Star, StarOff } from 'lucide-react';


const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  content: z.string().min(20, {
    message: "Content must be at least 20 characters.",
  }),
  status: z.string({
    message: "Please select a status.",
  }),
  images: z.any().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface ImagePreview {
  url: string;
  file?: File;
  isMain: boolean;
}

export default function NewsFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const isEditMode = !!id

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      status: "draft",
    },
  })

  useEffect(() => {
    if (isEditMode) {
      const fetchNewsData = async () => {
        try {
          setIsUploading(true);
          const response = await getNewsById(id);
          const newsData = response.data.message;
          
          
          form.reset({
            title: newsData.title,
            content: newsData.content,
            status: newsData.status || 'draft'
          });

          
          const initialPreviews: ImagePreview[] = [];

          
          if (newsData.imageUrl) {
            initialPreviews.push({
              url: newsData.imageUrl,
              isMain: true,
              
            });
          }

          
          if (newsData.images && Array.isArray(newsData.images)) {
            const additionalImages = newsData.images
              .filter(img => img.url !== newsData.imageUrl)
              .map(img => ({
                url: img.url,
                isMain: img.isMain || false,
                
              }));

            initialPreviews.push(...additionalImages);
          }

          
          setImagePreviews(initialPreviews);

        } catch (error) {
          console.error('Error fetching news data:', error);
          toast.error('Failed to fetch news data');
        } finally {
          setIsUploading(false);
        }
      };

      fetchNewsData();
    }
  }, [id, isEditMode, form]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsUploading(true);
      const files = Array.from(e.target.files || []);
      
      if (files.length === 0) return;

      const newPreviews: ImagePreview[] = files.map((file, index) => ({
        url: URL.createObjectURL(file),
        file,
        isMain: imagePreviews.length === 0 && index === 0
      }));

      setImagePreviews(prev => [...prev, ...newPreviews]);
    } catch (error) {
      console.error('Error processing images:', error);
      toast.error('Failed to process images. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImagePreviews(prev => {
      const newPreviews = prev.filter((_, i) => i !== index);
      
      if (prev[index].isMain && newPreviews.length > 0) {
        newPreviews[0].isMain = true;
      }
      
      if (!prev[index].file) {
        
        const deletedImageUrl = prev[index].url;
       
      }
      return newPreviews;
    });
  };

  const toggleMainImage = (index: number) => {
    setImagePreviews(prev => 
      prev.map((preview, i) => ({
        ...preview,
        isMain: i === index
      }))
    );
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(imagePreviews);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setImagePreviews(items);
  };

  async function onSubmit(values: FormValues) {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('content', values.content);
      formData.append('status', values.status);
      
     
      const existingImages = imagePreviews
        .filter(img => !img.file)
        .map(img => ({
          url: img.url,
          isMain: img.isMain
        }));
      
      formData.append('existingImages', JSON.stringify(existingImages));

      
      const newImages = imagePreviews.filter(img => img.file);
      const mainNewImage = newImages.find(img => img.isMain);
      const otherNewImages = newImages.filter(img => !img.isMain);
      const orderedNewImages = mainNewImage ? [mainNewImage, ...otherNewImages] : newImages;

      orderedNewImages.forEach(preview => {
        if (preview.file) {
          formData.append('images', preview.file);
        }
      });

      if (isEditMode) {
        await updateNews(id, formData);
        toast.success('News article updated successfully');
      } else {
        await createNews(formData);
        toast.success('News article created successfully');
      }
      
      navigate('/dashboard/news');
    } catch (error) {
      console.error('Error submitting news:', error);
      toast.error('Failed to submit. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="flex h-full w-full flex-col">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/news">News & Articles</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>Create Article</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </header>
      <main className="flex-1 overflow-auto p-6 bg-gray-50/50">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/dashboard/news">
              <Button variant="outline" size="icon" className="shadow-sm bg-transparent">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                {isEditMode ? 'Edit Article' : 'Create New Article'}
              </h1>
              <p className="text-lg text-gray-600 mt-2">
                {isEditMode ? 'Update existing article' : 'Write and publish a new news article'}
              </p>
            </div>
          </div>

          <div className="mx-auto max-w-4xl space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-t-lg">
                <CardTitle className="text-2xl text-gray-900">Article Information</CardTitle>
                <CardDescription className="text-gray-600">Fill in the article details</CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Article Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter the main title of your article" className="h-11" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700 font-medium">Content</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Write your article content here..."
                              className="min-h-[300px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>The main content of your article</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700 font-medium">Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11">
                                  <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="draft">Draft</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="images"
                        render={({ field: { value, ...field } }) => (
                          <FormItem className="col-span-2">
                            <FormLabel className="text-gray-700 font-medium">Images</FormLabel>
                            <FormControl>
                              <div className="space-y-4">
                                {/* Drag and drop zone */}
                                <div 
                                  className={`border-2 border-dashed rounded-lg p-6 text-center relative ${
                                    isDragging ? 'border-primary bg-primary/5' : 'border-gray-300'
                                  }`}
                                  onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                                  onDragOver={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsDragging(true);
                                  }}
                                  onDragLeave={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsDragging(false);
                                  }}
                                  onDrop={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setIsDragging(false);
                                    const files = Array.from(e.dataTransfer.files);
                                    if (files.some(file => !file.type.startsWith('image/'))) {
                                      toast.error('Only image files are allowed');
                                      return;
                                    }
                                    const newPreviews = files.map(file => ({
                                      url: URL.createObjectURL(file),
                                      file,
                                      isMain: imagePreviews.length === 0
                                    }));
                                    setImagePreviews(prev => [...prev, ...newPreviews]);
                                  }}
                                >
                                  {isUploading && (
                                    <div className="absolute inset-0 bg-black/10 flex items-center justify-center backdrop-blur-sm">
                                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    </div>
                                  )}
                                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                  <p className="mt-2 text-sm text-gray-600">
                                    {isUploading ? 'Processing images...' : 'Drag and drop images here, or click to select files'}
                                  </p>
                                  <Input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"
                                    onChange={handleImageChange}
                                    {...field}
                                  />
                                  <Button
                                    type="button"
                                    variant="outline"
                                    className="mt-4"
                                    onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                                  >
                                    Select Files
                                  </Button>
                                </div>

                                
                                {imagePreviews.length > 0 && (
                                  <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable droppableId="images">
                                      {(provided) => (
                                        <div
                                          {...provided.droppableProps}
                                          ref={provided.innerRef}
                                          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                                        >
                                          {imagePreviews.map((preview, index) => (
                                            <Draggable
                                              key={preview.url}
                                              draggableId={preview.url}
                                              index={index}
                                              isDragDisabled={isUploading}
                                            >
                                              {(provided) => (
                                                <div
                                                  ref={provided.innerRef}
                                                  {...provided.draggableProps}
                                                  className={`relative group rounded-lg overflow-hidden border-2 ${
                                                    preview.isMain ? 'border-primary' : 'border-transparent'
                                                  }`}
                                                >
                                                  <img
                                                    src={preview.url}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-40 object-cover"
                                                    onError={() => {
                                                      toast.error(`Failed to load preview for image ${index + 1}`);
                                                    }}
                                                  />
                                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                    <button
                                                      type="button"
                                                      onClick={() => toggleMainImage(index)}
                                                      className="p-1 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
                                                      title={preview.isMain ? "Main image" : "Set as main image"}
                                                    >
                                                      {preview.isMain ? (
                                                        <Star className="h-5 w-5 text-yellow-400" />
                                                      ) : (
                                                        <StarOff className="h-5 w-5 text-white" />
                                                      )}
                                                    </button>
                                                    <button
                                                      type="button"
                                                      onClick={() => removeImage(index)}
                                                      className="p-1 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
                                                    >
                                                      <X className="h-5 w-5 text-white" />
                                                    </button>
                                                    
                                                    {imagePreviews.length > 1 && (
                                                      <div
                                                        {...provided.dragHandleProps}
                                                        className="p-1 rounded-full bg-white/20 hover:bg-white/40 transition-colors cursor-move"
                                                      >
                                                        <GripVertical className="h-5 w-5 text-white" />
                                                      </div>
                                                    )}
                                                  </div>
                                                  
                                                  {!preview.file && (
                                                    <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                                                      Existing
                                                    </div>
                                                  )}
                                                  {preview.isMain && (
                                                    <div className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded">
                                                      Main Image
                                                    </div>
                                                  )}
                                                </div>
                                              )}
                                            </Draggable>
                                          ))}
                                          {provided.placeholder}
                                        </div>
                                      )}
                                    </Droppable>
                                  </DragDropContext>
                                )}
                              </div>
                            </FormControl>
                            <FormDescription>
                              Upload images for the article. Drag to reorder. Star icon sets the main image.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex gap-4 pt-6">
                      <Button
                        type="submit"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg px-8"
                      >
                        {isEditMode ? 'Update Article' : 'Create Article'}
                      </Button>
                      <Link to="/dashboard/news">
                        <Button variant="outline" className="px-8 bg-transparent shadow-sm">
                          Cancel
                        </Button>
                      </Link>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
