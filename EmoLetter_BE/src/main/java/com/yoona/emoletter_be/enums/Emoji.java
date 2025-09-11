package com.yoona.emoletter_be.enums;

public enum Emoji {
    HAPPY("https://cdn.my-diary.com/emojis/happy.png"),
    SAD("https://cdn.my-diary.com/emojis/sad.png"),
    LOVE("https://cdn.my-diary.com/emojis/love.png");

    private final String url;

    Emoji(String url) {
        this.url = url;
    }

    public String getUrl() {
        return url;
    }
}

