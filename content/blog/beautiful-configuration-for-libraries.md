---
external: false
draft: false
title: ✨ Beautiful typescript configuration files for seamless integration
description: Beautiful library configuration files ✨
date: 2023-10-29
---

# Starting the endeavour

**Have you ever wondered how you could build easy to type, easy to integrate, and simple to maintain TypeScript configuration files?** Even in projects that do not work with TypeScript.

In the dynamic and ever-evolving world of software development, the beauty of simplicity is often overlooked. We get so entangled in the intricacies of our code that we forget that the path to elegant solutions starts with the basics. Configuration files, while seemingly mundane, are a fundamental component of any project, and crafting them with care can make a world of difference in how your code integrates and scales.

In this blog post, we embark on a journey to explore the art of creating TypeScript configuration files that not only cater to TypeScript enthusiasts but also to developers working with various programming languages. Whether you are building a library or working on a project that extends beyond the TypeScript ecosystem, this guide will equip you with the knowledge and tools to create configuration files that are easy to type, easy to integrate, and simple to maintain.

## Reverse Engineering &mdash; vite's configuration-files

```typescript
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    // ... Specify options here.
  },
});
```

Simple configuration files like this, often found in popular libraries such as Vite, feel easy to use, lightweight to integrate, and straightforward to configure from a user's standpoint. But the question is, **how do they achieve these easy-to-use configuration files?**

The solution lies in their utilization of a library known as [`unconfig`](https://github.com/antfu/unconfig). This library serves the singular purpose of generating a unified configuration file from a single source, enabling support for multiple programming languages including Modularized JavaScript (mjs), Common (aka. vanilla) JS (cjs), TypeScript (ts), and JSON.

It leverages a strongly typed TypeScript approach that strengthens the core configuration structure. This empowers users to effortlessly track and adapt to any breaking changes within their configuration files. Unknown keys trigger errors during the parsing process, ensuring robustness. Additionally, it simplifies the utilization of the configuration file, enabling engineers to easily discover available configuration options without the hassle of scouring various [documentation sources](https://vitest.dev/config/) or resorting to online forums like [StackOverflow](https://stackoverflow.com/) &mdash; (still loving you ❤️).

## Crafting Your Own Library Configuration

Building a library configuration is a fundamental task in software development. It ensures your library is adaptable and user-friendly. In this guide, we'll walk you through the process of creating your own library configuration using the [`unconfig`](https://github.com/antfu/unconfig) library.

### Step 1: Obtain the Required Library

Before you start configuring your library, make sure you have the [`unconfig`](https://github.com/antfu/unconfig) library available. You can install it using npm, yarn, or pnpm:

```bash
npm install unconfig
```

### Step 2: Define Configuration Types

Define the types for your library's configuration. In this example, we'll create types similar to those used in the "vitest" library. The focus here is on keeping the example concise and informative.
I've called this file `config.ts` with the following content:

```typescript
export type ConfigParameters = { input: string };

export type CallableConfig<T> = ({ input }: ConfigParameters) => T | Promise<T>;

export type ResolvableConfig<T = AnyConfig> =
  | T
  | Promise<T>
  | CallableConfig<T>;

// Define the structure of your template configuration.
export type AnyConfig = {
  resolve: {
    alias: {
      "@": string;
    };
  };
};

// "defineConfig" is an identity function used to enforce types.
// It exports a function named "defineConfig" that accepts a ResolvableConfig
// as its argument and returns the same configuration.
export const defineConfig = (config: ResolvableConfig) => config;
```

These types allow you to create a flexible and strongly typed configuration system for your library.

### Step 3: Configure Your Configuration Parser

Next, configure the [`unconfig`](https://github.com/antfu/unconfig) library to locate and parse your library's configuration. Here's how to set it up in your code:

```typescript
import { loadConfig } from "unconfig";
import { ModuleConfig, ResolvableConfig } from "./defineConfig";

const { config, sources } = await loadConfig<ModuleConfig>({
  sources: [
    {
      files: "your.config.filename",
      async rewrite<F = ResolvableConfig>(config: F) {
        if (typeof config === "function") {
          return config({ input: "any-input" });
        }
        return config;
      },
    },
  ],
});

// just here for debug/test printing :)
// can certainly be removed for production usage
console.log(JSON.stringify({ config, sources }, null, 4));
```

This code configures [`unconfig`](https://github.com/antfu/unconfig) to load your library's configuration file and perform any necessary transformations. It then logs the resulting configuration and its sources.

### Step 4: Ingest Your Configuration

Now, let's create your configuration file, named `your.config.filename.ts`, that corresponds to your library's requirements:

```typescript
import { defineConfig } from "./defineConfig";

export default defineConfig(({ input }) => ({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src", input),
    },
  },
}));
```

This configuration file uses the types and structure defined earlier and customizes your library's settings based on the provided `input`.

### Step 5: The Happy Ending – Your Parsed Configuration 🚀

Once you've completed these steps, your library will be able to consume the configuration at any time. The internal object you receive will resemble the following:

```json
{
  "config": {
    "resolve": {
      "alias": {
        "@": "<full-path-redacted>/src/my-input"
      }
    }
  },
  "sources": ["<full-path-redacted>/your.config.filename.ts"]
}
```

This parsed configuration will empower your library to work seamlessly and adapt to different scenarios. By following these steps, you've created a user-friendly and adaptable library configuration, setting the stage for a smooth development experience.
Your configurations are the blueprints that empower your software to adapt, scale, and evolve. They are the silent heroes behind every successful project. So, invest your time and care in creating them thoughtfully, and you'll reap the benefits in the form of smoother development, happier users, and a more robust software ecosystem.

Happy coding, and may your configuration files always be a source of inspiration rather than frustration! 🚀🔧
Big thank you for everybody working at [vite](https://github.com/vitejs/vite), [vitest](https://github.com/vitest-dev/vitest) and special thanks to [antfu](https://github.com/antfu) for creating the library!
