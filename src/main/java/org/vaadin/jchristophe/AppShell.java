package org.vaadin.jchristophe;

import com.vaadin.flow.component.page.AppShellConfigurator;
import com.vaadin.flow.server.PWA;

/**
 * Use the @PWA annotation make the application installable on phones, tablets
 * and some desktop browsers.
 */
@PWA(name = "Cat Tracker", shortName = "cat-tracker")
public class AppShell implements AppShellConfigurator {
}
