import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createClient } from "@supabase/supabase-js";
import * as serviceModule from "../src/service";
import { SupabaseConfig } from "../src/types/types";
import { handler } from "../src/service";

vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(),
}));

vi.mock("../path/to/your/module", () => ({
  keepAlive: vi.fn().mockResolvedValue(undefined),
}));

describe("Tests of main business logic", async () => {
  let mockExit: any;
  let mockConsoleLog: any;
  let mockConsoleError: any;
  let mockConsoleWarn: any;

  beforeEach(() => {
    mockExit = vi.spyOn(process, "exit").mockImplementation((number) => {
      return undefined as never;
    });

    // // Mock console methods
    mockConsoleLog = vi.spyOn(console, "log").mockImplementation(() => {});
    mockConsoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    mockConsoleWarn = vi.spyOn(console, "warn").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("If dbUrl or dbAnonKey are not present in config, should skip operations", async () => {
    // given
    const mockConfig = {
      first: {
        dbAnonKey: "test-key-123",
      },
      second: {
        dbUrl: "https://prod-db.supabase.co",
      },
    };

    // when
    await handler(mockConfig as unknown as SupabaseConfig);

    // then
    expect(mockConsoleWarn).toBeCalledTimes(2);
    expect(mockConsoleWarn).toBeCalledWith(
      `Skipping first due to missing configuration.`
    );
    expect(mockConsoleWarn).toBeCalledWith(
      `Skipping second due to missing configuration.`
    );
  });

  it("If keepAlive supabase client cannot be created, keepAlive is not executed", async () => {
    // given
    const mockConfig = {
      first: {
        dbAnonKey: "test-key-123",
        dbUrl: "https://prod-db.supabase.co",
      },
    };
    const mockError = new Error("Client creation failed");
    (createClient as any).mockImplementationOnce(() => {
      throw mockError;
    });

    // when
    await handler(mockConfig as SupabaseConfig);

    // then
    expect(mockExit).toHaveBeenCalledWith(1);
    expect(mockConsoleError).toHaveBeenCalledWith(
      "An error occurred during the keep-alive process:",
      mockError
    );
  });

  it("If config is correct, should perform supabase queries", async () => {
    // given;
    const mockConfig = {
      first: {
        dbAnonKey: "test-key-123",
        dbUrl: "https://prod-db.supabase.co",
      },
      second: {
        dbAnonKey: "test-key-123",
        dbUrl: "https://prod-db.supabase.co",
      },
      third: {
        dbAnonKey: "test-key-123",
        dbUrl: "https://prod-db.supabase.co",
      },
    };
    vi.spyOn(serviceModule, "keepAlive").mockImplementation(async () => {
      console.log("Mock keepAlive called");
      Promise.resolve();
    });
    // when
    await handler(mockConfig as SupabaseConfig);

    // then
    expect(mockExit).toHaveBeenCalledWith(0);
    expect(mockConsoleLog).toHaveBeenCalledWith(
      "All keep-alive operations completed successfully."
    );
  });
});
