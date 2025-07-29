"use client";

import { IPagesParams } from "@/interfaces/IBaseParams";
import { generateImageToVideo } from "@/services/imagetovideo/imagetovideo.api";
import { IParamPrompt } from "@/services/imagetovideo/imagetovideo.types";
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Image,
  Input,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { ImagePlus } from "lucide-react";
import React, { useRef, useState } from "react";

const Home: React.FC<IPagesParams> = ({ params }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useMutation({
    mutationFn: (params: IParamPrompt) => generateImageToVideo(params),
  });

  const { setFieldValue, handleSubmit } = useFormik<IParamPrompt>({
    initialValues: {
      prompt: "",
      aspect_ratio: "9:16",
      duration: 10,
      resolution: "1080p",
      camera_fixed: "false",
      image: null,
    },
    onSubmit: (values: IParamPrompt) => {
      mutate(values, {
        onSuccess: (res) => {
          console.log(res);
        },
        onError: (err) => {
          console.log(err);
        },
      });
    },
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  function toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // encode ke base64
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  }
  const handleChangeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await toBase64(file);

    setFieldValue("image", base64);
  };

  return (
    <Container py={10}>
      <Stack spacing={3}>
        <FormControl>
          <FormLabel fontSize={"sm"}>Image</FormLabel>
          <Box
            border="1px dashed #ababab"
            w="300px"
            h={"400px"}
            aspectRatio={9 / 16}
            onClick={() => inputRef.current?.click()}
            cursor="pointer"
            overflow="hidden"
            position="relative"
            mx={"auto"}
          >
            <Center
              h="full"
              w="full"
              position="absolute"
              top={0}
              left={0}
              bg="gray.50"
            >
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  maxH="100%"
                  maxW="100%"
                  objectFit="cover"
                />
              ) : (
                <ImagePlus size={34} />
              )}
              <Input
                ref={inputRef}
                display="none"
                type="file"
                accept="image/*"
                onChange={handleChangeImage}
              />
            </Center>
          </Box>
        </FormControl>

        <FormControl>
          <FormLabel fontSize={"sm"}>Prompt</FormLabel>
          <Textarea
            name="prompt"
            rows={7}
            onChange={(e) => setFieldValue("prompt", e.target.value)}
          />
        </FormControl>
      </Stack>
      <Flex justify={"end"} gap={5}>
        <Button variant={"outline"} mt={5}>
          Cancel
        </Button>
        <Button mt={5} onClick={() => handleSubmit()}>
          Generate
        </Button>
      </Flex>
    </Container>
  );
};

export default Home;
