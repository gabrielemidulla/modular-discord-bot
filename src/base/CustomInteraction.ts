
import { CustomClient } from "CustomClient";
import { Interaction } from "discord.js";

export type CustomInteraction = Interaction & { client: CustomClient }